import React, { useEffect, useRef } from 'react';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkElevationReader from '@kitware/vtk.js/IO/Misc/ElevationReader';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkTexture from '@kitware/vtk.js/Rendering/Core/Texture';
import dem from '../dem.csv'
import demImage from '../images/dem.jpg';

const VtkExample4 = () => {
    const vtkContainerRef = useRef(null);
    const context = useRef(null);
    const baseUrl = window.location.origin;

    useEffect(() => {
        if (!context.current) {
            const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
                rootContainer: vtkContainerRef.current,
                background: [0, 0, 0],
            });

            const elevationReader = vtkElevationReader.newInstance({
                xSpacing: 0.01568,
                ySpacing: 0.01568,
                zScaling: 0.06666,
            });

            // Download and apply Texture
            const img = new Image();
            img.onload = function textureLoaded() {
                const texture = vtkTexture.newInstance();
                texture.setInterpolate(true);
                texture.setImage(img);
                actor.addTexture(texture);
                renderWindow.render();
            };
            img.src = demImage;

            elevationReader.setUrl(`${baseUrl + dem}`).then(() => {
                renderer.resetCamera();
                renderWindow.render();
            });

            const mapper = vtkMapper.newInstance();
            mapper.setInputConnection(elevationReader.getOutputPort());

            const actor = vtkActor.newInstance();
            actor.setMapper(mapper);

            const renderer = fullScreenRenderer.getRenderer();
            const renderWindow = fullScreenRenderer.getRenderWindow();

            renderer.addActor(actor);
            renderer.resetCamera();
            renderWindow.render();

            // console.log(actor.setMapper(mapper))

            context.current = {
                fullScreenRenderer,
                actor,
                mapper,
                img,
                elevationReader,
            };
        }

        return () => {
            if (context.current) {
                context.current = null;
            }
        };
    }, []);

    return <>
        <header className="App-header"
                style={{position: 'relative', textAlign: 'center', zIndex: 1000, color: 'red'}}
        >
            <h2>3D model with elevation data</h2>
        </header>
        <div ref={vtkContainerRef} style={{ width: '500px', height: '500px' }} />
    </>;
};

export default VtkExample4;