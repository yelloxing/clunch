import { isFunction } from '@hai2007/tool/type';

// 属性deep值计算

let calcDeepValue = (oldValue, newValue, deep) => {

    // 首先，参与动画,而且值不一样
    if (newValue.animation && oldValue.value != newValue.value) {

        // 1.先判断是否在组件中自定义了计算方法

        if (isFunction(newValue.animation)) {
            return {
                type: newValue.type,
                animation: true,
                value: newValue.animation(newValue.value, oldValue.value, deep)
            };
        }

        // 2.内置计算

        // 数字类型
        if (newValue.type == 'number') {
            return {
                type: newValue.type,
                animation: true,
                value: (newValue.value - oldValue.value) * deep + oldValue.value
            };
        }

    }

    // 其它情况原样返回
    return newValue;

};

// 获取数据改变后deep对应的实时数据计算方法

export default function (oldRenderSeries, newRenderSeries) {

    let linkIdToIndex = {};

    // 收集组件id和index的映射
    for (let index = 0; index < oldRenderSeries.length; index++) {
        let subLinkIdToIndex = {};

        // 收集子属性组件的id和index的映射
        for (let subIndex = 0; subIndex < oldRenderSeries[index].subAttr.length; subIndex++) {
            subLinkIdToIndex[oldRenderSeries[index].subAttr[subIndex].id] = subIndex;
        }

        // 收集完毕后，保存起来
        linkIdToIndex[oldRenderSeries[index].id] = {
            index,
            subLinkIdToIndex
        };
    }

    // 返回一个可以根据当前deep获取当前实际组件的方法
    return deep => {

        // 如果deep=1直接返回新组件即可
        if (deep == 1) return newRenderSeries;

        let renderSeries = [];
        for (let i = 0; i < newRenderSeries.length; i++) {

            // 如果在旧的存在对照的
            if (newRenderSeries[i].id in linkIdToIndex) {

                // 对应的旧组件
                let oldSeries = oldRenderSeries[linkIdToIndex[newRenderSeries[i].id].index];

                let attr = {};
                // 先计算属性
                for (let attrKey in oldSeries.attr) {
                    attr[attrKey] = calcDeepValue(oldSeries.attr[attrKey], newRenderSeries[i].attr[attrKey], deep);
                }

                let subAttr = [];
                // 计算是子组件
                for (let j = 0; j < newRenderSeries[i].subAttr.length; j++) {

                    if (newRenderSeries[i].subAttr[j].id in linkIdToIndex[newRenderSeries[i].id].subLinkIdToIndex) {

                        // 对于的旧子属性组件
                        let oldSubSeries = oldSeries.subAttr[linkIdToIndex[newRenderSeries[i].id].subLinkIdToIndex[newRenderSeries[i].subAttr[j].id]];

                        let subSeriesAttr = {};
                        // 计算子组件属性
                        for (let subSeriesAttrKey in oldSubSeries.attr) {
                            subSeriesAttr[subSeriesAttrKey] = calcDeepValue(oldSubSeries.attr[subSeriesAttrKey], newRenderSeries[i].subAttr[j].attr[subSeriesAttrKey], deep);
                        }

                        subAttr.push({
                            id: oldSubSeries.id,
                            name: oldSubSeries.name,
                            subText: oldSubSeries.subText,
                            subAttr: [],
                            attr: subSeriesAttr
                        });

                    } else {
                        subAttr.push(newRenderSeries[i].subAttr[j]);
                    }

                }

                renderSeries.push({
                    id: newRenderSeries[i].id,
                    name: newRenderSeries[i].name,
                    subText: newRenderSeries[i].subText,
                    subAttr,
                    attr
                });

            }

            // 如果在旧的组件列表里面不存在对照
            else {

                if (newRenderSeries[i].animation == 'quick') {
                    renderSeries.push(newRenderSeries[i]);
                }

            }
        }

        return renderSeries;

    };
};
