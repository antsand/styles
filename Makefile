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
STYLES_DOC_CSS = ../styles_doc/public/css

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

# Sync compiled CSS to styles_doc (flat structure)
sync-to-docs:
	@echo "Syncing CSS to styles_doc/public/css..."
	@mkdir -p $(STYLES_DOC_CSS)
	@cp $(CSS_DIR)/antsand-v2*.css $(STYLES_DOC_CSS)/
	@echo "✓ Synced all v2 CSS files to $(STYLES_DOC_CSS)/"

# Help
help:
	@echo "ANTSAND v2 Build System"
	@echo ""
	@echo "Available targets:"
	@echo "  make                - Compile all v2 files (default)"
	@echo "  make fonts          - Compile fonts only"
	@echo "  make nav            - Compile navigation only"
	@echo "  make tabs           - Compile tabs only"
	@echo "  make master         - Compile master antsand.scss"
	@echo "  make sync-to-docs   - Copy compiled CSS to styles_doc/public/css"
	@echo "  make clean          - Remove compiled CSS"
	@echo "  make watch          - Watch and auto-compile"
	@echo "  make help           - Show this help"
	@echo ""
	@echo "All source files are in: $(SASS_V2_DIR)/"
	@echo "All compiled files go to: $(CSS_DIR)/"
	@echo ""
	@echo "Quick workflow:"
	@echo "  make tabs           - Compile tabs"
	@echo "  make sync-to-docs   - Push to styles_doc"

.PHONY: all fonts nav tabs master sync-to-docs clean watch help
