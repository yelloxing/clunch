
import { initPainterConfig } from '../../painter/config';

export function initGlobal(Clunch) {

    // 组件图形复用
    Clunch.prototype.$reuseSeriesLink = function (seriesName, _attrs) {

        // 画笔配置重置，防止副作用
        this.__painter.config(initPainterConfig);

        // 获取需要复用的组件实体
        let reuseSeries = this.__defineSerirs[seriesName];

        let attrs = {
            _subAttr: [],
            _subTexts: "texts" in _attrs ? _attrs.texts : []
        };

        // 先是属性
        for (let attrKey in reuseSeries.attrs) {
            if (attrKey in _attrs.attr) {
                attrs[attrKey] = _attrs.attr[attrKey];
            } else {
                attrs[attrKey] = reuseSeries.attrs[attrKey].default;
            }
        }

        if ("subSeries" in _attrs) {
            for (let i = 0; i < _attrs.subSeries.length; i++) {
                let _subSeries = _attrs.subSeries[i];
                let _subReuesSeriesAttr = reuseSeries.subAttrs[_subSeries.name];
                let subSeries = {
                    series: _subSeries.name,
                    attr: {}
                };

                // 然后是子属性
                for (let subAttrKey in _subSeries.attr) {
                    if (subAttrKey in _subSeries.attr) {
                        subSeries.attr[subAttrKey] = _subSeries.attr[subAttrKey];
                    } else {
                        subSeries.attr[subAttrKey] = _subReuesSeriesAttr[subAttrKey].default;
                    }
                }

                attrs._subAttr.push(subSeries);
            }
        }

        reuseSeries.link.call(this, this.__painter, attrs);
    };

}
