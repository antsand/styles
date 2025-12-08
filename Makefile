# ANTSAND v2 - Build System
# All v2 components are in sass_v2/
#
# DEPLOYMENT ARCHITECTURE:
# ========================
# 1. Compile here: sass_v2/ → css/
# 2. Sync to styles_doc: make sync-to-docs
#    This copies to: ../styles_doc/public/css/ (flat structure)
# 3. Both preview UI and deployed sites use SAME files
#
# Usage:
#   make                - Compile all v2 SCSS files
#   make fonts          - Compile fonts only
#   make nav            - Compile navigation only
#   make tabs           - Compile tabs only
#   make master         - Compile master antsand-v2.scss
#   make sync-to-docs   - Copy compiled CSS to styles_doc/public/css
#   make clean          - Remove compiled CSS
#   make watch          - Watch and auto-compile

# Directories
SASS_V2_DIR = sass_v2
CSS_DIR = css
JS_V2_DIR = js_v2
FONTS_DIR = fonts
DSL_TEMPLATES_DIR = dsl_templates

# styles_doc destinations
STYLES_DOC_CSS = ../styles_doc/public/css
STYLES_DOC_JS = ../styles_doc/public/js
STYLES_DOC_FONTS = ../styles_doc/public/fonts
STYLES_DOC_TEMPLATES = ../styles_doc/public/dsl_templates

# Main antsand site destinations
ANTSAND_CSS = ../public/css
ANTSAND_JS = ../public/js
ANTSAND_TEMPLATES = ../public/dsl_templates

# Source files (in sass_v2/)
V2_FONTS = $(SASS_V2_DIR)/antsand-v2-fonts.scss
V2_NAV = $(SASS_V2_DIR)/antsand-v2-nav.scss
V2_TABS = $(SASS_V2_DIR)/antsand-v2-tabs.scss
V2_MASTER = $(SASS_V2_DIR)/antsand-v2.scss

# Output files (in css/)
CSS_FONTS = $(CSS_DIR)/antsand-v2-fonts.css
CSS_NAV = $(CSS_DIR)/antsand-v2-nav.css
CSS_TABS = $(CSS_DIR)/antsand-v2-tabs.css
CSS_MASTER = $(CSS_DIR)/antsand-v2.css

# Default target - compile all v2 files
all: fonts nav tabs master
	@echo "✓ All v2 files compiled"

# Compile individual components
fonts:
	@echo "Compiling antsand-v2-fonts..."
	@sassc $(V2_FONTS) $(CSS_FONTS)
	@echo "✓ Compiled: $(CSS_FONTS)"

nav:
	@echo "Compiling antsand-v2-nav..."
	@sassc $(V2_NAV) $(CSS_NAV)
	@echo "✓ Compiled: $(CSS_NAV)"

tabs:
	@echo "Compiling antsand-v2-tabs..."
	@sassc $(V2_TABS) $(CSS_TABS)
	@echo "✓ Compiled: $(CSS_TABS)"

master:
	@echo "Compiling master antsand-v2.scss..."
	@sassc $(V2_MASTER) $(CSS_MASTER)
	@echo "✓ Compiled: $(CSS_MASTER)"

# Clean compiled CSS
clean:
	@echo "Cleaning compiled CSS..."
	@rm -f $(CSS_DIR)/antsand-v2*.css
	@echo "✓ Cleaned"

# Watch for changes (requires inotifywait)
watch:
	@echo "Watching sass_v2/ for changes..."
	@while true; do \
		inotifywait -e modify,create,delete -r $(SASS_V2_DIR) && \
		make all; \
	done

# Sync compiled CSS to styles_doc
sync-to-docs:
	@echo "Syncing CSS to styles_doc/public/css..."
	@mkdir -p $(STYLES_DOC_CSS)
	@cp $(CSS_DIR)/antsand-v2*.css $(STYLES_DOC_CSS)/
	@echo "✓ Synced all v2 CSS files to $(STYLES_DOC_CSS)/"

# Sync JS v2 to styles_doc (includes modules/ subdirectory for ES6)
sync-js-docs:
	@echo "Syncing JS v2 to styles_doc/public/js..."
	@mkdir -p $(STYLES_DOC_JS)/modules
	@if [ -d "$(JS_V2_DIR)" ]; then \
		cp $(JS_V2_DIR)/*.js $(STYLES_DOC_JS)/ 2>/dev/null || true && \
		cp $(JS_V2_DIR)/modules/*.js $(STYLES_DOC_JS)/modules/ 2>/dev/null || true && \
		chmod -R 644 $(STYLES_DOC_JS)/*.js $(STYLES_DOC_JS)/modules/*.js 2>/dev/null || true && \
		echo "✓ Synced v2 JS (including modules/) to $(STYLES_DOC_JS)/"; \
	else \
		echo "⚠ JS v2 directory not found at $(JS_V2_DIR)"; \
	fi

# Sync JS v2 to main antsand site (includes modules/ subdirectory for ES6)
sync-js-antsand:
	@echo "Syncing JS v2 to main antsand site..."
	@mkdir -p $(ANTSAND_JS)/modules
	@if [ -d "$(JS_V2_DIR)" ]; then \
		cp $(JS_V2_DIR)/*.js $(ANTSAND_JS)/ 2>/dev/null || true && \
		cp $(JS_V2_DIR)/modules/*.js $(ANTSAND_JS)/modules/ 2>/dev/null || true && \
		chmod -R 644 $(ANTSAND_JS)/*.js $(ANTSAND_JS)/modules/*.js 2>/dev/null || true && \
		echo "✓ Synced v2 JS (including modules/) to $(ANTSAND_JS)/"; \
	else \
		echo "⚠ JS v2 directory not found at $(JS_V2_DIR)"; \
	fi

# Sync JS v2 to both sites
sync-js: sync-js-docs sync-js-antsand
	@echo "✓ JS v2 synced to both styles_doc and antsand"

# Sync DSL templates to styles_doc
sync-templates:
	@echo "Syncing DSL templates to styles_doc..."
	@mkdir -p $(STYLES_DOC_TEMPLATES)
	@if [ -d "$(DSL_TEMPLATES_DIR)" ]; then \
		cp -r $(DSL_TEMPLATES_DIR)/* $(STYLES_DOC_TEMPLATES)/ && \
		chmod -R 644 $(STYLES_DOC_TEMPLATES)/*.json 2>/dev/null || true && \
		chmod -R 644 $(STYLES_DOC_TEMPLATES)/**/*.json 2>/dev/null || true && \
		echo "✓ Synced DSL templates to $(STYLES_DOC_TEMPLATES)/"; \
	else \
		echo "⚠ DSL templates directory not found at $(DSL_TEMPLATES_DIR)"; \
	fi

# Sync fonts to styles_doc
sync-fonts:
	@echo "Syncing fonts to styles_doc/public/fonts..."
	@mkdir -p $(STYLES_DOC_FONTS)
	@if [ -d "$(FONTS_DIR)" ]; then \
		rsync -av --delete $(FONTS_DIR)/ $(STYLES_DOC_FONTS)/ && \
		echo "✓ Synced fonts to $(STYLES_DOC_FONTS)/"; \
	else \
		echo "⚠ Fonts directory not found at $(FONTS_DIR)"; \
	fi

# List available fonts
list-fonts:
	@echo "Available font families in $(FONTS_DIR)/:"
	@ls -d $(FONTS_DIR)/*/ 2>/dev/null | xargs -n1 basename || echo "  No font directories found"
	@echo ""
	@echo "Standalone fonts:"
	@ls $(FONTS_DIR)/*.woff* $(FONTS_DIR)/*.ttf $(FONTS_DIR)/*.otf 2>/dev/null | xargs -n1 basename || echo "  None"

# Sync DSL templates to main antsand site
sync-dsl-antsand:
	@echo "Syncing DSL templates to main antsand site..."
	@mkdir -p $(ANTSAND_TEMPLATES)
	@if [ -d "$(DSL_TEMPLATES_DIR)" ]; then \
		rsync -av --delete $(DSL_TEMPLATES_DIR)/ $(ANTSAND_TEMPLATES)/ && \
		echo "✓ Synced DSL templates to $(ANTSAND_TEMPLATES)/"; \
	else \
		echo "⚠ DSL templates directory not found at $(DSL_TEMPLATES_DIR)"; \
	fi

# Sync CSS to main antsand site
sync-css-antsand:
	@echo "Syncing CSS to main antsand site..."
	@mkdir -p $(ANTSAND_CSS)
	@cp $(CSS_DIR)/antsand-v2*.css $(ANTSAND_CSS)/
	@echo "✓ Synced v2 CSS files to $(ANTSAND_CSS)/"

# Sync all DSL templates (to both styles_doc and antsand)
sync-dsl: sync-templates sync-dsl-antsand
	@echo "✓ DSL templates synced to both styles_doc and antsand"

# Sync all CSS (to both styles_doc and antsand)
sync-css: sync-to-docs sync-css-antsand
	@echo "✓ CSS synced to both styles_doc and antsand"

# Full sync to styles_doc only
sync-docs: sync-to-docs sync-js-docs sync-templates sync-fonts
	@echo "✓ All files synced to styles_doc"

# Full sync to main antsand site only
sync-antsand: sync-css-antsand sync-js-antsand sync-dsl-antsand
	@echo "✓ All files synced to main antsand site"

# Full sync - CSS, JS, templates, and fonts to BOTH sites
sync-all: sync-to-docs sync-js-docs sync-templates sync-fonts sync-css-antsand sync-js-antsand sync-dsl-antsand
	@echo "✓ All files synced to both styles_doc and antsand"

# Help
help:
	@echo "ANTSAND v2 Build System"
	@echo ""
	@echo "Build targets:"
	@echo "  make                - Compile all v2 files (default)"
	@echo "  make fonts          - Compile fonts only"
	@echo "  make nav            - Compile navigation only"
	@echo "  make tabs           - Compile tabs only"
	@echo "  make master         - Compile master antsand.scss"
	@echo "  make clean          - Remove compiled CSS"
	@echo "  make watch          - Watch and auto-compile"
	@echo ""
	@echo "Sync to styles_doc:"
	@echo "  make sync-to-docs   - Copy compiled CSS to styles_doc"
	@echo "  make sync-js-docs   - Copy JS v2 to styles_doc"
	@echo "  make sync-templates - Copy DSL templates to styles_doc"
	@echo "  make sync-fonts     - Copy fonts to styles_doc"
	@echo "  make sync-docs      - Sync all to styles_doc (CSS, JS, DSL, fonts)"
	@echo ""
	@echo "Sync to main antsand site:"
	@echo "  make sync-css-antsand - Copy v2 CSS to antsand"
	@echo "  make sync-js-antsand  - Copy JS v2 to antsand"
	@echo "  make sync-dsl-antsand - Copy DSL templates to antsand"
	@echo "  make sync-antsand     - Sync all to antsand (CSS, JS, DSL)"
	@echo ""
	@echo "Sync to BOTH sites:"
	@echo "  make sync-css       - Sync CSS to both sites"
	@echo "  make sync-js        - Sync JS v2 to both sites"
	@echo "  make sync-dsl       - Sync DSL templates to both sites"
	@echo "  make sync-all       - Sync everything to both sites"
	@echo ""
	@echo "Other:"
	@echo "  make list-fonts     - List available font families"
	@echo "  make help           - Show this help"
	@echo ""
	@echo "Directories:"
	@echo "  SCSS source:        $(SASS_V2_DIR)/"
	@echo "  JS v2 source:       $(JS_V2_DIR)/"
	@echo "  Compiled CSS:       $(CSS_DIR)/"
	@echo "  DSL Templates:      $(DSL_TEMPLATES_DIR)/"
	@echo "  styles_doc CSS:     $(STYLES_DOC_CSS)/"
	@echo "  styles_doc JS:      $(STYLES_DOC_JS)/"
	@echo "  styles_doc DSL:     $(STYLES_DOC_TEMPLATES)/"
	@echo "  antsand CSS:        $(ANTSAND_CSS)/"
	@echo "  antsand JS:         $(ANTSAND_JS)/"
	@echo "  antsand DSL:        $(ANTSAND_TEMPLATES)/"
	@echo ""
	@echo "Quick workflows:"
	@echo "  make && make sync-all             - Build + sync everything"
	@echo "  make sync-js                      - Push JS v2 to both sites"
	@echo "  make tabs && make sync-css        - Compile tabs + push CSS"

.PHONY: all fonts nav tabs master clean watch help \
        sync-to-docs sync-js-docs sync-templates sync-fonts sync-docs \
        sync-css-antsand sync-js-antsand sync-dsl-antsand sync-antsand \
        sync-css sync-js sync-dsl sync-all list-fonts
