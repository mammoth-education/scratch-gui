import {defineMessages} from 'react-intl';
import sharedMessages from '../shared-messages';

let messages = defineMessages({
    hello: {
        defaultMessage: 'Hello',
        description: 'Name for the hello sound',
        id: 'gui.defaultProject.hello'
    },
    happy: {
        defaultMessage: 'Happy',
        description: 'Name for the happy sound',
        id: 'gui.defaultProject.happy'
    },
    angry: {
        defaultMessage: 'Angry',
        description: 'Name for the angry sound',
        id: 'gui.defaultProject.angry'
    },
    variable: {
        defaultMessage: 'my variable',
        description: 'Name for the default variable',
        id: 'gui.defaultProject.variable'
    }
});

messages = {...messages, ...sharedMessages};

// use the default message if a translation function is not passed
const defaultTranslator = msgObj => msgObj.defaultMessage;

/**
 * Generate a localized version of the default project
 * @param {function} translateFunction a function to use for translating the default names
 * @return {object} the project data json for the default project
 */
const projectData = translateFunction => {
    const translator = translateFunction || defaultTranslator;
    return ({
        targets: [
            {
                isStage: true,
                name: 'Stage',
                variables: {
                    '`jEk@4|i[#Fk?(8x)AV.-my variable': [
                        translator(messages.variable),
                        0
                    ]
                },
                lists: {},
                broadcasts: {},
                blocks: {},
                currentCostume: 0,
                costumes: [
                    {
                        assetId: 'cd21514d0531fdffb22204e0ec5ed84a',
                        name: translator(messages.backdrop, {index: 1}),
                        md5ext: 'cd21514d0531fdffb22204e0ec5ed84a.svg',
                        dataFormat: 'svg',
                        rotationCenterX: 240,
                        rotationCenterY: 180
                    }
                ],
                sounds: [
                    {
                        assetId: '83a9787d4cb6f3b7632b4ddfebf74367',
                        name: translator(messages.pop),
                        dataFormat: 'wav',
                        format: '',
                        rate: 11025,
                        sampleCount: 258,
                        md5ext: '83a9787d4cb6f3b7632b4ddfebf74367.wav'
                    }
                ],
                volume: 100
            },
            {
                isStage: false,
                name: translator(messages.sprite, {index: 1}),
                variables: {},
                lists: {},
                broadcasts: {},
                blocks: {},
                currentCostume: 0,
                costumes: [
                    {
                        assetId: 'e16824c5ba273352154ac3ffd9accb04', // 长毛象走路01
                        name: translator(messages.costume, {index: 1}),
                        bitmapResolution: 1,
                        md5ext: 'e16824c5ba273352154ac3ffd9accb04.svg', // 长毛象走路01
                        dataFormat: 'svg',
                        rotationCenterX: 48,
                        rotationCenterY: 50
                    },
                    {
                        assetId: '7e1e5f4fa01ec1ad46c35c0fd1f62f6a', // 长毛象走路02
                        name: translator(messages.costume, {index: 2}),
                        bitmapResolution: 1,
                        md5ext: '7e1e5f4fa01ec1ad46c35c0fd1f62f6a.svg', // 长毛象走路02
                        dataFormat: 'svg',
                        rotationCenterX: 46,
                        rotationCenterY: 53
                    }
                ],
                sounds: [
                    {
                        assetId: 'cbd998228640afe6d702c41f2484ac79',
                        name: translator(messages.hello),
                        dataFormat: 'wav',
                        format: '',
                        rate: 22050,
                        sampleCount: 18688,
                        md5ext: 'cbd998228640afe6d702c41f2484ac79.wav'
                    },
                    {
                        assetId: '0952b63e05813a2f8f1a7c635e7b4584',
                        name: translator(messages.happy),
                        dataFormat: 'wav',
                        format: '',
                        rate: 22050,
                        sampleCount: 18688,
                        md5ext: '0952b63e05813a2f8f1a7c635e7b4584.wav'
                    },
                    {
                        assetId: '403631b7bfeb0a45ae8a06db5d271aae',
                        name: translator(messages.angry),
                        dataFormat: 'wav',
                        format: '',
                        rate: 22050,
                        sampleCount: 18688,
                        md5ext: '403631b7bfeb0a45ae8a06db5d271aae.wav'
                    }
                ],
                volume: 100,
                visible: true,
                x: 0,
                y: 0,
                size: 100,
                direction: 90,
                draggable: false,
                rotationStyle: 'all around'
            }
        ],
        meta: {
            semver: '3.0.0',
            vm: '0.1.0',
            agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36' // eslint-disable-line max-len
        }
    });
};


export default projectData;
