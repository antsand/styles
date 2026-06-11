const DESKTOP_QUERY = '(min-width: 1180px)';
const SIDE_NOTE_SELECTOR = '.blog-annotated-block > .blog-side-note, .blog-side-note-anchor > .blog-side-note';
const STACK_GAP = 18;

function getSide(note) {
    return note.classList.contains('blog-side-note--left') ? 'left' : 'right';
}

function resetNote(note) {
    note.style.removeProperty('--blog-side-note-offset');
}

function layoutSideNotes() {
    const notes = Array.from(document.querySelectorAll(SIDE_NOTE_SELECTOR));

    notes.forEach(resetNote);

    if (!window.matchMedia(DESKTOP_QUERY).matches || notes.length < 2) {
        return notes;
    }

    const stateBySide = new Map();

    notes
        .map((note) => ({ note, rect: note.getBoundingClientRect(), side: getSide(note) }))
        .sort((a, b) => a.rect.top - b.rect.top)
        .forEach(({ note, rect, side }) => {
            const lastBottom = stateBySide.get(side) ?? Number.NEGATIVE_INFINITY;
            const offset = Math.max(0, lastBottom + STACK_GAP - rect.top);

            if (offset > 0) {
                note.style.setProperty('--blog-side-note-offset', `${Math.ceil(offset)}px`);
            }

            stateBySide.set(side, rect.bottom + offset);
        });

    return notes;
}

function debounceFrame(fn) {
    let frame = 0;
    return () => {
        if (frame) {
            cancelAnimationFrame(frame);
        }
        frame = requestAnimationFrame(() => {
            frame = 0;
            fn();
        });
    };
}

export function initAllSideNoteLayout() {
    const notes = layoutSideNotes();

    if (!notes.length || document.documentElement.dataset.sideNoteLayoutReady === 'true') {
        return notes;
    }

    document.documentElement.dataset.sideNoteLayoutReady = 'true';
    const relayout = debounceFrame(layoutSideNotes);

    window.addEventListener('resize', relayout, { passive: true });
    window.addEventListener('load', relayout, { once: true });

    if (document.fonts?.ready) {
        document.fonts.ready.then(relayout).catch(() => {});
    }

    const observer = new MutationObserver(relayout);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
    });

    return notes;
}
