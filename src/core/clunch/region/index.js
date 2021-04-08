import _painter from '../../painter/index';
import getStyle from '../../../tool/get-style';
import { position } from '../../../tool/event';
import { initPainterConfig } from '../../painter/config';

// 区域对象，用于存储区域信息,解决canvas交互问题

export default function (that) {

    let regions = {},//区域映射表
        rgb = [0, 0, 0],//区域标识色彩,rgb(0,0,0)表示空白区域
        p = 'r';//色彩增值位置

    // 用于计算包含关系的画板
    let canvas = document.createElement('canvas');
    let painter = _painter(canvas, 1, 1);

    let _width = 1, _height = 1;

    let regions_data = {};

    return {

        // 擦除
        "erase": function () {
            painter.config({
                fillStyle: 'rgb(255,255,255)'
            }).fillRect(0, 0, _width, _height);

            // 清空记录的数据
            regions_data = {};
        },

        // 更新大小
        "updateSize": function (width, height) {

            _width = width;
            _height = height;
            painter = _painter(canvas, width, height);

        },

        // 绘制（添加）区域范围
        /**
         * region_id：区域唯一标识（一个标签上可以维护多个区域）
         */
        "painter": function (region_id, data) {

            if (regions[region_id] == undefined) regions[region_id] = {
                'r': function () {
                    rgb[0] += 1;
                    p = 'g';
                    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                },
                'g': function () {
                    rgb[1] += 1;
                    p = 'b';
                    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                },
                'b': function () {
                    rgb[2] += 1;
                    p = 'r';
                    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                }
            }[p]();

            painter.config(initPainterConfig).config({
                fillStyle: regions[region_id],
                strokeStyle: regions[region_id]
            });

            // 记录数据
            regions_data[region_id] = data;

            return painter;

        },

        // 获取此刻鼠标所在区域
        "getRegion": function (event) {
            let pos = position(that.__canvas, event);
            pos.x -= getStyle(that.__canvas, 'border-left-width').replace('px', '');
            pos.y -= getStyle(that.__canvas, 'border-top-width').replace('px', '');
            let currentRGBA = canvas.getContext("2d").getImageData(pos.x * 2 - 0.5, pos.y * 2 - 0.5, 1, 1).data;
            for (let i in regions) {
                if ("rgb(" + currentRGBA[0] + "," + currentRGBA[1] + "," + currentRGBA[2] + ")" == regions[i]) {
                    return [i, pos.x, pos.y, regions_data[i]];
                }
            }

            // 说明当前不在任何区域
            return [null, pos.x, pos.y, null];
        }

    };

};
