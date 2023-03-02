import layout, {STAGE_DISPLAY_SCALES, STAGE_SIZE_MODES, STAGE_DISPLAY_SIZES, STAGE_VITUAL_KEYBOARD_WIDTH} from '../lib/layout-constants';

/**
 * @typedef {object} StageDimensions
 * @property {int} height - the height to be used for the stage in the current situation.
 * @property {int} width - the width to be used for the stage in the current situation.
 * @property {number} scale - the scale factor from the stage's default size to its current size.
 * @property {int} heightDefault - the height of the stage in its default (large) size.
 * @property {int} widthDefault - the width of the stage in its default (large) size.
 */

const STAGE_DIMENSION_DEFAULTS = {
    // referencing css/units.css,
    // spacingBorderAdjustment = 2 * $full-screen-top-bottom-margin +
    //   2 * $full-screen-border-width
    fullScreenSpacingBorderAdjustment: 12,
    // referencing css/units.css,
    // menuHeightAdjustment = $stage-menu-height
    menuHeightAdjustment: 44,
    menuBarHeight: 48,
    previewWidth: 240,
    previewHeight: 180,
};

/**
 * Resolve the current GUI and browser state to an actual stage size enum value.
 * @param {STAGE_SIZE_MODES} stageSizeMode - the state of the stage size toggle button.
 * @param {boolean} isFullSize - true if the window is large enough for the large stage at its full size.
 * @return {STAGE_DISPLAY_SIZES} - the stage size enum value we should use in this situation.
 */
const resolveStageSize = (stageSizeMode, isFullSize) => {
    if (stageSizeMode === STAGE_SIZE_MODES.small) {
        return STAGE_DISPLAY_SIZES.small;
    }
    if (isFullSize) {
        return STAGE_DISPLAY_SIZES.large;
    }
    return STAGE_DISPLAY_SIZES.largeConstrained;
};

/**
 * Retrieve info used to determine the actual stage size based on the current GUI and browser state.
 * @param {STAGE_DISPLAY_SIZES} stageSize - the current fully-resolved stage size.
 * @param {boolean} isFullScreen - true if full-screen mode is enabled.
 * @param {boolean} isMobile - true if is mobile
 * @param {boolean} isPreview - true if is small preview window
 * @return {StageDimensions} - an object describing the dimensions of the stage.
 */
const getStageDimensions = (stageSize, isFullScreen, isMobile, isPreview) => {
    const stageDimensions = {
        heightDefault: layout.standardStageHeight,
        widthDefault: layout.standardStageWidth,
        height: 0,
        width: 0,
        scale: 0
    };
    let isSmallDevice = false;
    if (window.screen.width < layout.fullSizeMinWidth || window.innerWidth < layout.fullSizeMinWidth) {
        isSmallDevice = true;
    }
    if (isFullScreen) {
        stageDimensions.height = window.innerHeight -
            STAGE_DIMENSION_DEFAULTS.fullScreenSpacingBorderAdjustment;
        if (!isSmallDevice) {
            stageDimensions.height -= STAGE_DIMENSION_DEFAULTS.menuHeightAdjustment;
        }

        stageDimensions.width = stageDimensions.height + (stageDimensions.height / 3);

        let maxWidth = window.innerWidth;
        if (isMobile) {
            maxWidth -= STAGE_VITUAL_KEYBOARD_WIDTH;
        }
    
        if (stageDimensions.width > maxWidth) {
            stageDimensions.width = maxWidth;
            stageDimensions.height = stageDimensions.width * .75;
        }
        stageDimensions.scale = stageDimensions.width / stageDimensions.widthDefault;
    } else {
        if (isSmallDevice) {
            if (isPreview) {
                stageDimensions.height = STAGE_DIMENSION_DEFAULTS.previewHeight;
                stageDimensions.width = STAGE_DIMENSION_DEFAULTS.previewWidth;
            } else {
                stageDimensions.height = window.innerHeight -
                    STAGE_DIMENSION_DEFAULTS.menuHeightAdjustment -
                    STAGE_DIMENSION_DEFAULTS.menuBarHeight -
                    STAGE_DIMENSION_DEFAULTS.fullScreenSpacingBorderAdjustment;
                stageDimensions.width = stageDimensions.height + (stageDimensions.height / 3);
                console.log(STAGE_DISPLAY_SCALES[stageSize])
                let maxWidth = window.innerWidth - STAGE_DISPLAY_SCALES[stageSize] * stageDimensions.widthDefault;
                if (stageDimensions.width > maxWidth) {
                    stageDimensions.width = maxWidth;
                    stageDimensions.height = stageDimensions.width * .75;
                }
            }
        } else {
            stageDimensions.scale = STAGE_DISPLAY_SCALES[stageSize];
            stageDimensions.height = stageDimensions.scale * stageDimensions.heightDefault;
            stageDimensions.width = stageDimensions.scale * stageDimensions.widthDefault;
        }
    }

    // Round off dimensions to prevent resampling/blurriness
    stageDimensions.height = Math.round(stageDimensions.height);
    stageDimensions.width = Math.round(stageDimensions.width);

    return stageDimensions;
};

/**
 * Take a pair of sizes for the stage (a target height and width and a default height and width),
 * calculate the ratio between them, and return a CSS transform to scale to that ratio.
 * @param {object} sizeInfo An object containing dimensions of the target and default stage sizes.
 * @param {number} sizeInfo.width The target width
 * @param {number} sizeInfo.height The target height
 * @param {number} sizeInfo.widthDefault The default width
 * @param {number} sizeInfo.heightDefault The default height
 * @returns {object} the CSS transform
 */
const stageSizeToTransform = ({width, height, widthDefault, heightDefault}) => {
    const scaleX = width / widthDefault;
    const scaleY = height / heightDefault;
    if (scaleX === 1 && scaleY === 1) {
        // Do not set a transform if the scale is 1 because
        // it messes up `position: fixed` elements like the context menu.
        return;
    }
    return {transform: `scale(${scaleX},${scaleY})`};
};

export {
    getStageDimensions,
    resolveStageSize,
    stageSizeToTransform
};
