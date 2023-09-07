import React, { useEffect, useRef } from 'react';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkElevationReader from '@kitware/vtk.js/IO/Misc/ElevationReader';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkTexture from '@kitware/vtk.js/Rendering/Core/Texture';
import demData from '../dem.csv';
import demImage from '../images/dem.jpg';
import demImage2 from '../images/dem2.jpg';

const VtkExample2 = () => {
    const vtkContainerRef = useRef(null);
    const context = useRef(null);

    useEffect(() => {
        if (!context.current) {
            const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
                rootContainer: vtkContainerRef.current,
                background: [0, 0, 0],
            });


            // Create and configure texture for layer 1
            const elevationReader1 = vtkElevationReader.newInstance({
                xSpacing: 0.01568,
                ySpacing: 0.01568,
                zScaling: 0.1,
            });
            const img1 = new Image();
            img1.onload = function textureLoaded1() {
                const texture1 = vtkTexture.newInstance();
                texture1.setInterpolate(true);
                texture1.setImage(img1);
                actor1.addTexture(texture1);
                renderWindow.render();
            };
            img1.src = demImage;

            elevationReader1.setUrl(`https://kitware.github.io/vtk-js/data/elevation/dem.csv`).then((result) => {
                console.log(result)
                renderer.resetCamera();
                renderWindow.render();
            });

            const mapper1 = vtkMapper.newInstance();
            mapper1.setInputConnection(elevationReader1.getOutputPort());

            const actor1 = vtkActor.newInstance();
            actor1.setMapper(mapper1);

            // Create and configure elevation reader, texture, and actor for layer 2
            const elevationReader2 = vtkElevationReader.newInstance({
                xSpacing: 0.01568,
                ySpacing: 0.01568,
                zScaling: 0.2,
            });

            const img2 = new Image();
            img2.onload = function textureLoaded2() {
                const texture2 = vtkTexture.newInstance();
                texture2.setInterpolate(true);
                texture2.setImage(img2);
                actor2.addTexture(texture2);
                renderWindow.render();
            };
            img2.src = demImage2;

            elevationReader2.setUrl(`https://example.com/your-second-dataset.csv`).then((result) => {
                console.log(result)
                renderer.resetCamera();
                renderWindow.render();
            });

            const mapper2 = vtkMapper.newInstance();
            mapper2.setInputConnection(elevationReader2.getOutputPort());

            const actor2 = vtkActor.newInstance();
            actor2.setMapper(mapper2);


            // renderer
            const renderer = fullScreenRenderer.getRenderer();
            const renderWindow = fullScreenRenderer.getRenderWindow();

            // Add actors for both layers to the renderer
            renderer.addActor(actor1);
            renderer.addActor(actor2);

            // Reset the camera and render the scene
            renderer.resetCamera();
            renderWindow.render();

            context.current = {
                fullScreenRenderer,
                actor1,
                actor2,
                mapper1,
                mapper2,
                img1,
                img2,
                elevationReader1,
                elevationReader2,
            };
            console.log(context.current)
        }

        return () => {
            if (context.current) {
                context.current = null;
            }
        };
    }, []);

    return (
        <>
            <h2
                style={{
                    position: 'relative',
                    textAlign: 'center',
                    zIndex: 1000,
                    color: 'red',
                }}>3D model with elevation data</h2>

            <div
                ref={vtkContainerRef}
                style={{ width: '500px', height: '500px' }}
            />
        </>
    );
};

export default VtkExample2;
