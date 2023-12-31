import '@kitware/vtk.js/favicon';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkElevationReader from '@kitware/vtk.js/IO/Misc/ElevationReader';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkTexture from '@kitware/vtk.js/Rendering/Core/Texture';

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
    background: [0, 0, 0],
});
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();

// ----------------------------------------------------------------------------
// Example code
// ----------------------------------------------------------------------------

const reader = vtkElevationReader.newInstance({
    xSpacing: 0.01568,
    ySpacing: 0.01568,
    zScaling: 0.06666,
});
const mapper = vtkMapper.newInstance();
const actor = vtkActor.newInstance();

mapper.setInputConnection(reader.getOutputPort());
actor.setMapper(mapper);

renderer.addActor(actor);
renderer.resetCamera();
renderWindow.render();

// Download and apply Texture
const img = new Image();
img.onload = function textureLoaded() {
    const texture = vtkTexture.newInstance();
    texture.setInterpolate(true);
    texture.setImage(img);
    actor.addTexture(texture);
    renderWindow.render();
};
img.src = `${__BASE_PATH__}/data/elevation/dem.jpg`;

// Download elevation and render when ready
reader.setUrl(`${__BASE_PATH__}/data/elevation/dem.csv`).then(() => {
    renderer.resetCamera();
    renderWindow.render();
});

// -----------------------------------------------------------
// Make some variables global so that you can inspect and
// modify objects in your browser's developer console:
// -----------------------------------------------------------

global.reader = reader;
global.mapper = mapper;
global.actor = actor;
global.renderer = renderer;
global.renderWindow = renderWindow;