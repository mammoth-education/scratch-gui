import storage from './storage';

const generateId = () => {
    let randomPart = Math.random().toString(36).substring(2, 15);
    let timestampPart = Date.now().toString(36);
    return randomPart + timestampPart;
}

const newProject = (name) => {
    name = name || "New Project";
    let id = generateId();
    let projectList = localStorage.getItem('project-list') || "{}";
    projectList = JSON.parse(projectList);
    projectList[id] = {
        id: id,
        name: name,
        createDate: Date.now(),
        updateDate: Date.now(),
    }
    localStorage.setItem("project-list", JSON.stringify(projectList));
    return id;
}

/**
 * Save a project JSON to the project server.
 * This should eventually live in scratch-www.
 * @param {number} id the ID of the project, null if a new project.
 * @param {object} data the JSON project representation.
 * @param {object} params the request params.
 * @property {?number} params.originalId the original project ID if a copy/remix.
 * @property {?boolean} params.isNew a flag indicating if this save is creating a new.
 * @property {?boolean} params.isCopy a flag indicating if this save is creating a copy.
 * @property {?boolean} params.isRemix a flag indicating if this save is creating a remix.
 * @property {?string} params.title the title of the project.
 * @return {Promise} A promise that resolves when the network request resolves.
 */
const saveProject = (id, data, options) => {
    if (options) {
        if (options.isNew) {
            id = newProject(options.title);
        } else if (options.isCopy || options.isRemix) {
            id = newProject(options.title);
            let originalAsset = storage.load(storage.AssetType.Project, options.origialId, storage.DataFormat.JSON);
            data = originalAsset.data;
        }
    } else {
        let projectList = localStorage.getItem('project-list', "{}");
        projectList = JSON.parse(projectList);
        projectList[id].updateDate = Date.now(),
        localStorage.setItem("project-list", JSON.stringify(projectList));
    }

    return storage.store(storage.AssetType.Project, storage.DataFormat.JSON, data, id);
}

export default saveProject;
