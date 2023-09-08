import React, { useEffect, useRef, useState } from 'react';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkElevationReader from '@kitware/vtk.js/IO/Misc/ElevationReader';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkTexture from '@kitware/vtk.js/Rendering/Core/Texture';
import demImage from '../images/dem.jpg';
import demImage2 from '../images/dem2.jpg';
import dem from '../dem.csv';
import dem2 from '../dem2.csv';

const VtkExample4 = () => {
    const vtkContainerRef = useRef(null);
    const context = useRef(null);
    const baseUrl = window.location.origin;

    // State variables to track layer visibility
    const [layer1Visible, setLayer1Visible] = useState(false);
    const [layer2Visible, setLayer2Visible] = useState(true);

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
                zScaling: 1,
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
            elevationReader1.setUrl(`${baseUrl + dem}`).then(() => {
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
                zScaling: 0.1,
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
            elevationReader2.setUrl(`${baseUrl + dem2}`).then((result) => {
                console.log(result);
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
            console.log(context.current);
        }

        return () => {
            if (context.current) {
                context.current = null;
            }
        };
    }, []);

    // useEffect for handling visibility changes
    useEffect(() => {
        if (context.current) {
            context.current.actor1.setVisibility(layer1Visible);
            context.current.actor2.setVisibility(layer2Visible);
            context.current.fullScreenRenderer.getRenderWindow().render();
        }
    }, [layer1Visible, layer2Visible]);

    return (
        <>
            <h2
                style={{
                    position: 'relative',
                    textAlign: 'center',
                    zIndex: 2,
                    color: 'red',
                }}
            >
                3D model with elevation data
            </h2>
            <div
                style={{
                    position: 'absolute',
                    top: '25px',
                    left: '25px',
                    zIndex: 2,
                    background: 'white',
                    padding: '12px',
                }}
            >
                <label>
                    Layer 1:
                    <input
                        type="checkbox"
                        checked={layer1Visible}
                        onChange={() => setLayer1Visible(!layer1Visible)}
                    />
                </label>

                <label>
                    Layer 2:
                    <input
                        type="checkbox"
                        checked={layer2Visible}
                        onChange={() => setLayer2Visible(!layer2Visible)}
                    />
                </label>
            </div>

            <div
                ref={vtkContainerRef}
                style={{ width: '500px', height: '500px' }}
            />
        </>
    );
};

export default VtkExample4;
