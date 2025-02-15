import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';

import Box from '../box/box.jsx';
import SpriteInfo from '../../containers/sprite-info.jsx';
import SpriteList from './sprite-list.jsx';
import ActionMenu from '../action-menu/action-menu.jsx';
import { STAGE_DISPLAY_SIZES } from '../../lib/layout-constants';
import { isRtl } from 'scratch-l10n';

import styles from './sprite-selector.css';

import fileUploadIcon from '../action-menu/icon--file-upload.svg';
import paintIcon from '../action-menu/icon--paint.svg';
import spriteIcon from '../action-menu/icon--sprite.svg';
import surpriseIcon from '../action-menu/icon--surprise.svg';
import searchIcon from '../action-menu/icon--search.svg';

const messages = defineMessages({
    addSpriteFromLibrary: {
        id: 'gui.spriteSelector.addSpriteFromLibrary',
        description: 'Button to add a sprite in the target pane from library',
        defaultMessage: 'Choose a Sprite'
    },
    addSpriteFromPaint: {
        id: 'gui.spriteSelector.addSpriteFromPaint',
        description: 'Button to add a sprite in the target pane from paint',
        defaultMessage: 'Paint'
    },
    addSpriteFromSurprise: {
        id: 'gui.spriteSelector.addSpriteFromSurprise',
        description: 'Button to add a random sprite in the target pane',
        defaultMessage: 'Surprise'
    },
    addSpriteFromFile: {
        id: 'gui.spriteSelector.addSpriteFromFile',
        description: 'Button to add a sprite in the target pane from file',
        defaultMessage: 'Upload Sprite'
    }
});

const SpriteSelectorComponent = function (props) {
    const {
        editingTarget,
        hoveredTarget,
        intl,
        onChangeSpriteDirection,
        onChangeSpriteName,
        onChangeSpriteRotationStyle,
        onChangeSpriteSize,
        onChangeSpriteVisibility,
        onChangeSpriteX,
        onChangeSpriteY,
        onDrop,
        onDeleteSprite,
        onDuplicateSprite,
        onExportSprite,
        onFileUploadClick,
        onNewSpriteClick,
        onPaintSpriteClick,
        onSelectSprite,
        onSpriteUpload,
        onSurpriseSpriteClick,
        raised,
        selectedId,
        spriteFileInput,
        sprites,
        stageSize,
        isMobile,
        selectedTabIndex,
        isSmallDevice,
        ...componentProps
    } = props;
    let selectedSprite = sprites[selectedId];
    let spriteInfoDisabled = false;
    if (typeof selectedSprite === 'undefined') {
        selectedSprite = {};
        spriteInfoDisabled = true;
    }
    let fileAccept = isMobile ? 'svg, png, bmp, jpg, jpeg, sprite2, sprite3, gif' : '.svg, .png, .bmp, .jpg, .jpeg, .sprite2, .sprite3, .gif';
    return (
        <Box
            className={styles.spriteSelector}
            {...componentProps}
        >
            {
                (!isMobile || selectedTabIndex === 3) &&
                <SpriteInfo
                    direction={selectedSprite.direction}
                    disabled={spriteInfoDisabled}
                    name={selectedSprite.name}
                    rotationStyle={selectedSprite.rotationStyle}
                    size={selectedSprite.size}
                    stageSize={stageSize}
                    visible={selectedSprite.visible}
                    x={selectedSprite.x}
                    y={selectedSprite.y}
                    onChangeDirection={onChangeSpriteDirection}
                    onChangeName={onChangeSpriteName}
                    onChangeRotationStyle={onChangeSpriteRotationStyle}
                    onChangeSize={onChangeSpriteSize}
                    onChangeVisibility={onChangeSpriteVisibility}
                    onChangeX={onChangeSpriteX}
                    onChangeY={onChangeSpriteY}
                />
            }

            <SpriteList
                editingTarget={editingTarget}
                hoveredTarget={hoveredTarget}
                items={Object.keys(sprites).map(id => sprites[id])}
                raised={raised}
                selectedId={selectedId}
                onDeleteSprite={onDeleteSprite}
                onDrop={onDrop}
                onDuplicateSprite={onDuplicateSprite}
                onExportSprite={onExportSprite}
                onSelectSprite={onSelectSprite}
            />
            {/* 选择一个角色 */}
            <ActionMenu
                className={styles.addButton}
                img={spriteIcon}
                moreButtons={[
                    {
                        title: intl.formatMessage(messages.addSpriteFromFile), //子按钮的标题
                        img: fileUploadIcon,
                        onClick: onFileUploadClick,
                        fileAccept: fileAccept, //文件限制
                        fileChange: onSpriteUpload, //上传完成的回调
                        fileInput: spriteFileInput, //上传文件的 input 元素
                        fileMultiple: true //是否支持多个文件上传
                    }, {
                        title: intl.formatMessage(messages.addSpriteFromSurprise),
                        img: surpriseIcon,
                        onClick: onSurpriseSpriteClick // TODO need real function for this
                    }, {
                        title: intl.formatMessage(messages.addSpriteFromPaint),
                        img: paintIcon,
                        onClick: onPaintSpriteClick // TODO need real function for this
                    }, {
                        title: intl.formatMessage(messages.addSpriteFromLibrary),
                        img: searchIcon,
                        onClick: onNewSpriteClick
                    }
                ]}
                title={intl.formatMessage(messages.addSpriteFromLibrary)}
                tooltipPlace={isRtl(intl.locale) ? 'right' : 'left'}
                onClick={onNewSpriteClick}
            />
        </Box>
    );
};

SpriteSelectorComponent.propTypes = {
    editingTarget: PropTypes.string,
    hoveredTarget: PropTypes.shape({
        hoveredSprite: PropTypes.string,
        receivedBlocks: PropTypes.bool
    }),
    intl: intlShape.isRequired,
    onChangeSpriteDirection: PropTypes.func,
    onChangeSpriteName: PropTypes.func,
    onChangeSpriteRotationStyle: PropTypes.func,
    onChangeSpriteSize: PropTypes.func,
    onChangeSpriteVisibility: PropTypes.func,
    onChangeSpriteX: PropTypes.func,
    onChangeSpriteY: PropTypes.func,
    onDeleteSprite: PropTypes.func,
    onDrop: PropTypes.func,
    onDuplicateSprite: PropTypes.func,
    onExportSprite: PropTypes.func,
    onFileUploadClick: PropTypes.func,
    onNewSpriteClick: PropTypes.func,
    onPaintSpriteClick: PropTypes.func,
    onSelectSprite: PropTypes.func,
    onSpriteUpload: PropTypes.func,
    onSurpriseSpriteClick: PropTypes.func,
    raised: PropTypes.bool,
    selectedId: PropTypes.string,
    spriteFileInput: PropTypes.func,
    sprites: PropTypes.shape({
        id: PropTypes.shape({
            costume: PropTypes.shape({
                url: PropTypes.string,
                name: PropTypes.string.isRequired,
                bitmapResolution: PropTypes.number.isRequired,
                rotationCenterX: PropTypes.number.isRequired,
                rotationCenterY: PropTypes.number.isRequired
            }),
            name: PropTypes.string.isRequired,
            order: PropTypes.number.isRequired
        })
    }),
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired
};

export default injectIntl(SpriteSelectorComponent);
