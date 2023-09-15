import React, { useEffect, useRef, useState } from 'react';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkElevationReader from '@kitware/vtk.js/IO/Misc/ElevationReader';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkTexture from '@kitware/vtk.js/Rendering/Core/Texture';
import demImage from '../images/dem.jpg';



const VtkExample4 = () => {
    const vtkContainerRef = useRef(null);
    const context = useRef(null);

    // State variables to track layer visibility, space between layers, and opacity values
    const [layer1Visible, setLayer1Visible] = useState(true);
    const [layer2Visible, setLayer2Visible] = useState(true);
    const [spaceBetweenLayers, setSpaceBetweenLayers] = useState(-1);
    const [opacityValue1, setOpacityValue1] = useState(1); // Opacity for the first layer
    const [opacityValue2, setOpacityValue2] = useState(0.5); // Opacity for the second layer
    const [layer2Color, setLayer2Color] = useState('#f90101'); // Color for the second layer


    const hexToRgb = (hex) => {
        hex = hex.replace(/^#/, '');
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b]; // Return an array of [r, g, b]
    }

    useEffect(() => {
        if (!context.current) {
            const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
                rootContainer: vtkContainerRef.current,
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
            elevationReader1.setUrl('https://kitware.github.io/vtk-js/data/elevation/dem.csv').then(() => {
                renderer.resetCamera();
                renderWindow.render();
            });
            const mapper1 = vtkMapper.newInstance();
            mapper1.setInputConnection(elevationReader1.getOutputPort());
            const actor1 = vtkActor.newInstance();
            actor1.setMapper(mapper1);

            // Create and configure elevation reader, and actor for layer 2
            const elevationReader2 = vtkElevationReader.newInstance({
                xSpacing: 0.01568,
                ySpacing: 0.01568,
                zScaling: 0.1,
            });

            elevationReader2.setUrl('https://kitware.github.io/vtk-js/data/elevation/dem.csv').then(() => {
                renderer.resetCamera();
                renderWindow.render();
            });

            const mapper2 = vtkMapper.newInstance();
            mapper2.setInputConnection(elevationReader2.getOutputPort());
            const actor2 = vtkActor.newInstance();
            actor2.setMapper(mapper2);
            // Set the texture for actor2
            // actor2.addTexture(changeLayerColor(layer2Color));
            // Adjust the position of Layer 2 in the z-axis using spaceBetweenLayers
            actor2.setPosition(0, 0, spaceBetweenLayers);

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
                elevationReader1,
                elevationReader2,
            };
        }

        return () => {
            if (context.current) {
                context.current = null;
            }
        };
    }, []); // No dependencies, only runs once

    // useEffect for handling visibility changes
    useEffect(() => {
        if (context.current) {
            context.current.actor1.setVisibility(layer1Visible);
            context.current.actor2.setVisibility(layer2Visible);
            context.current.fullScreenRenderer.getRenderWindow().render();
        }
    }, [layer1Visible, layer2Visible]);

    // useEffect for handling spaceBetweenLayers changes
    useEffect(() => {
        if (context.current) {
            // Adjust the position of Layer 2 in the z-axis using spaceBetweenLayers
            context.current.actor2.setPosition(0, 0, spaceBetweenLayers);
            context.current.fullScreenRenderer.getRenderWindow().render();
        }
    }, [spaceBetweenLayers]);

    // useEffect for handling opacityValue changes
    useEffect(() => {
        if (context.current) {
            // Update the opacity of actor1 (first layer)
            context.current.actor1.getProperty().setOpacity(opacityValue1);
            // Update the opacity of actor2 (second layer)
            context.current.actor2.getProperty().setOpacity(opacityValue2);
            context.current.fullScreenRenderer.getRenderWindow().render();
        }
    }, [opacityValue1, opacityValue2]);



    // useEffect for handling layer2Color changes
    useEffect(() => {
        if (context.current) {
            const colorArray = hexToRgb(layer2Color);
            context.current.actor2.getProperty().setColor(...colorArray);
            context.current.fullScreenRenderer.getRenderWindow().render();
        }
    }, [layer2Color]);

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
            <table
                style={{
                    position: 'absolute',
                    top: '25px',
                    left: '25px',
                    background: 'white',
                    padding: '12px',
                    zIndex: 2,
                }}
            >
                <tbody>
                <tr>
                    <td>
                        <label>
                            Layer 1 Opacity:
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={opacityValue1}
                                onChange={(e) => setOpacityValue1(parseFloat(e.target.value))}
                            />
                        </label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>
                            Layer 2 Opacity:
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={opacityValue2}
                                onChange={(e) => setOpacityValue2(parseFloat(e.target.value))}
                            />
                        </label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>
                            Layer 2 Color:
                            <input
                                type="color"
                                value={layer2Color}
                                onChange={(e) => setLayer2Color(e.target.value)}
                            />
                        </label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>
                            Layer 1:
                            <input
                                type="checkbox"
                                checked={layer1Visible}
                                onChange={() => setLayer1Visible(!layer1Visible)}
                            />
                        </label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>
                            Layer 2:
                            <input
                                type="checkbox"
                                checked={layer2Visible}
                                onChange={() => setLayer2Visible(!layer2Visible)}
                            />
                        </label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>
                            Space Between Layers:
                            <input
                                type="range"
                                min="-5"
                                max="0"
                                step="0.5"
                                value={spaceBetweenLayers}
                                onChange={(e) => setSpaceBetweenLayers(parseFloat(e.target.value))}
                            />
                        </label>
                    </td>
                </tr>
                </tbody>
            </table>

            <div
                ref={vtkContainerRef}
                style={{ width: '500px', height: '500px' }}
            />
        </>
    );
};

export default VtkExample4;
