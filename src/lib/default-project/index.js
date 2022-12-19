import projectData from './project-data';

/* eslint-disable import/no-unresolved */
import popWav from '!arraybuffer-loader!./83a9787d4cb6f3b7632b4ddfebf74367.wav';
import mammothHelloWav from '!arraybuffer-loader!./cbd998228640afe6d702c41f2484ac79.wav';
import mammothHappyWav from '!arraybuffer-loader!./0952b63e05813a2f8f1a7c635e7b4584.wav';
import mammothAngryWav from '!arraybuffer-loader!./403631b7bfeb0a45ae8a06db5d271aae.wav';
import backdrop from '!raw-loader!./cd21514d0531fdffb22204e0ec5ed84a.svg';
import costume1 from '!raw-loader!./e16824c5ba273352154ac3ffd9accb04.svg';
import costume2 from '!raw-loader!./7e1e5f4fa01ec1ad46c35c0fd1f62f6a.svg';
/* eslint-enable import/no-unresolved */

const defaultProject = translator => {
    let _TextEncoder;
    if (typeof TextEncoder === 'undefined') {
        _TextEncoder = require('text-encoding').TextEncoder;
    } else {
        /* global TextEncoder */
        _TextEncoder = TextEncoder;
    }
    const encoder = new _TextEncoder();

    const projectJson = projectData(translator);
    return [{
        id: 0,
        assetType: 'Project',
        dataFormat: 'JSON',
        data: JSON.stringify(projectJson)
    }, {
        id: '83a9787d4cb6f3b7632b4ddfebf74367',
        assetType: 'Sound',
        dataFormat: 'WAV',
        data: new Uint8Array(popWav)
    }, {
        id: 'cbd998228640afe6d702c41f2484ac79', // 你好
        assetType: 'Sound',
        dataFormat: 'WAV',
        data: new Uint8Array(mammothHelloWav)
    }, {
        id: '0952b63e05813a2f8f1a7c635e7b4584', // 开心
        assetType: 'Sound',
        dataFormat: 'WAV',
        data: new Uint8Array(mammothHappyWav)
    }, {
        id: '403631b7bfeb0a45ae8a06db5d271aae', // 生气
        assetType: 'Sound',
        dataFormat: 'WAV',
        data: new Uint8Array(mammothAngryWav)
    }, {
        id: 'cd21514d0531fdffb22204e0ec5ed84a',
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: encoder.encode(backdrop)
    }, {
        id: 'e16824c5ba273352154ac3ffd9accb04',  // 长毛象走路01
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: encoder.encode(costume1)
    }, {
        id: '7e1e5f4fa01ec1ad46c35c0fd1f62f6a',  // 长毛象走路02
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: encoder.encode(costume2)
    }];
};

export default defaultProject;
