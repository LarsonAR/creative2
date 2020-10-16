const ALLCAMS = [
    "ENTRY", "FHAZ", "RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM", "PANCAM", "MINITES"
];
let cameras = [];
let rover = "";
let sol = 0;
let apiKey = "T20QngGFAEQbQ4ouoFaCmhuzwSSyePO5muVkdJHE";

function clear() {
    document.getElementById("cameras").style.display = "none";
    document.getElementById("solControls").style.display = "none";
    clearPhoto();
}

function clearPhoto() {
    document.getElementById("photo").src = "";
}

async function getRover(e) {
    rover = e.target.value;
    sol = -1;
    await incrementSol(e);
    document.getElementById("sol").textContent = "SOL " + sol;
    document.getElementById("solControls").style.display = "block";
}

async function getCameras() {
    let manifestURL = "https://api.nasa.gov/mars-photos/api/v1/manifests/" + rover + "?api_key=" + apiKey;
    await fetch(manifestURL).then((r) => r.json()).then(json => {
        cameras = json.photo_manifest.photos.find(e => e.sol === sol).cameras;
        console.log(cameras);
        for (let cam of ALLCAMS) {
            document.getElementById(cam).style.display = "none";
        }
        for (let cam of cameras) {
            document.getElementById(cam).style.display = "inline";
        }
    });
    document.getElementById("cameras").style.display = "block";
}

async function incrementSol(e) {
    e.preventDefault();
    let manifestURL = "https://api.nasa.gov/mars-photos/api/v1/manifests/" + rover + "?api_key=" + apiKey;
    await fetch(manifestURL).then((r) => r.json()).then(json => {
        sols = json.photo_manifest.photos.map(e => e.sol);
        let nextSol = sols.find(e => e>sol);
        if (nextSol !== undefined) {
            sol = nextSol;
            clearPhoto();
        }
    });
    document.getElementById("sol").textContent = "SOL " + sol;
    await getCameras();
}

async function decrementSol(e) {
    e.preventDefault();
    let manifestURL = "https://api.nasa.gov/mars-photos/api/v1/manifests/" + rover + "?api_key=" + apiKey;
    await fetch(manifestURL).then((r) => r.json()).then(json => {
        sols = json.photo_manifest.photos.map(e => e.sol);
        let prevSol = sols.find(e => e<sol);
        if (prevSol !== undefined) {
            sol = prevSol;
            clearPhoto();
        }
    });
    document.getElementById("sol").textContent = "SOL " + sol;
    await getCameras();
}

async function selectCamera(e) {
    e.preventDefault();
    let camera = e.target.value;
    let url = "https://api.nasa.gov/mars-photos/api/v1/rovers/" + rover + "/photos?sol=" +
              sol + "&camera=" + camera + "&api_key=" + apiKey;
    console.log(url);
    await fetch(url).then(r => r.json()).then(json => {
        if (json.photos.length === 0) document.getElementById("photo").src = "";
        else document.getElementById("photo").src = json.photos[0].img_src;
    });
}

document.getElementById("pickrover").addEventListener("change", (e) => {
    e.preventDefault();
    if (e.target.value !== "") return getRover(e);
    else clear();
});

document.getElementById("incSol").addEventListener("click", incrementSol);
document.getElementById("decSol").addEventListener("click", decrementSol);
document.getElementById("ENTRY").addEventListener("click", selectCamera);
document.getElementById("FHAZ").addEventListener("click", selectCamera);
document.getElementById("RHAZ").addEventListener("click", selectCamera);
document.getElementById("MAST").addEventListener("click", selectCamera);
document.getElementById("CHEMCAM").addEventListener("click", selectCamera);
document.getElementById("MAHLI").addEventListener("click", selectCamera);
document.getElementById("MARDI").addEventListener("click", selectCamera);
document.getElementById("NAVCAM").addEventListener("click", selectCamera);
document.getElementById("PANCAM").addEventListener("click", selectCamera);
document.getElementById("MINITES").addEventListener("click", selectCamera);