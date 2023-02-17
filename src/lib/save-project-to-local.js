import storage from './storage';

const generateId = () => {
    let randomPart = Math.random().toString(36).substring(2, 15);
    let timestampPart = Date.now().toString(36);
    return randomPart + timestampPart;
}

const newProject = (name) => {
    name = name || "New Project";
    let id = generateId();
    let time = Date.now();
    return {
        id:id,
        description: {
            id: id,
            name: name,
            createDate: time,
            updateDate: time,
        }
    }
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
    let projectList = localStorage.getItem('project-list') || "{}";
    projectList = JSON.parse(projectList);
    let description;

    if (options) {
        if (options.isNew || options.isCopy || options.isRemix) {
            ( {id, description} = newProject(options.title) );
            projectList[id] = description;
        } else {
            if (!projectList[id]) {
                ( {id, description} = newProject(options.title) );
                projectList[id] = description;
            }
            projectList[id].name = options.title;
        }
    }

    projectList[id].updateDate = Date.now();
    localStorage.setItem("project-list", JSON.stringify(projectList));
    return storage.store(storage.AssetType.Project, storage.DataFormat.JSON, data, id);
}

export default saveProject;
