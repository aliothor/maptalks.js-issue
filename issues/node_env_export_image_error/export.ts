import fs from 'node:fs/promises'
import path from 'node:path';
import maptalks from 'maptalks/dist/maptalks.es'
import { createCanvas, loadImage } from "@napi-rs/canvas";

const testBase64Path = path.join(import.meta.dirname, 'data/test_base64')

initMap()

async function initMap() {
    const canvas = createCanvas(1920, 1080);

    const map = new maptalks.Map(canvas, {
        center: [-0.113049, 51.498568],
        zoom: 16,
    });

    const polygon = new maptalks.Polygon(
        [
            [
                [-0.131049, 51.498568],
                [-0.107049, 51.498568],
                [-0.107049, 51.493568],
                [-0.131049, 51.493568],
                [-0.131049, 51.498568],
            ],
        ],
        {
            visible: true,
            editable: true,
            cursor: "pointer",
            shadowBlur: 0,
            shadowColor: "black",
            draggable: false,
            dragShadow: false, // display a shadow during dragging
            drawOnAxis: null, // force dragging stick on a axis, can be: x, y
            symbol: {
                lineColor: "#34495e",
                lineWidth: 2,
                polygonFill: "rgb(135,196,240)",
                polygonOpacity: 0.6,
            },
        }
    );

    new maptalks.VectorLayer("vector", polygon).addTo(map);

    const img: string | null = map.toDataURL({
        mimeType: "image/png",
        save: false,
    });

    // const base64Str = await fs.readFile(testBase64Path, { encoding: 'utf-8' })

    if (img) {
        await writeToImage(img)
        console.error('图片导出完成')
    } else {
        console.error('image data', img)
        console.error('图片导出失败,img对象为空')
    }

    process.exit()

}

async function writeToImage(str: string, imagePath = path.join(import.meta.dirname, 'test.png')) {
    const temp = str.replace(/^data:image\/\w+;base64,/, "");
    const dataBuffer = Buffer.from(temp, "base64");
    await fs.writeFile(imagePath, dataBuffer);
}