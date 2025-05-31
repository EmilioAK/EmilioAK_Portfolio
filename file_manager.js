const files = {
    "emilio.md": {
        path: "/emilio.md",
        language: "markdown",
        model: null
    },
    "script.js": {
        path: "/script.js",
        language: "javascript",
        model: null
    },
};

async function loadModel(filename) {
    const entry = files[filename];
    if (!entry) throw new Error(`No config for ${filename}`);
    if (entry.model) return entry.model;

    const resp = await fetch(entry.path);
    if (!resp.ok) throw new Error(`Failed to fetch ${entry.path}`);
    const text = await resp.text();

    entry.model = monaco.editor.createModel(
        text,
        entry.language,
        monaco.Uri.parse(`file:///${filename}`)
    );
    return entry.model;
}

async function switchToFile(filename) {
    const model = await loadModel(filename);
    editor.setModel(model);
}

async function preloadAllModels() {
    const promises = Object.keys(files).map(name => loadModel(name));
    await Promise.all(promises);
}

window.fileManager = {
    switchToFile,
    preloadAllModels
};