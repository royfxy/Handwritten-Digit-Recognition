const MODEL_URL = '/tfjs_model/model.json';
model = null;

async function loadModel() {
    return await tf.loadLayersModel(MODEL_URL);
}

loadModel().then(e => {
    model = e;
    sketcher.clear()
});