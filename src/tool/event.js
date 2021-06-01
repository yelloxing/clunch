
// 绑定事件

export function bind(target, eventType, callback) {
    if (window.attachEvent) {
        target.attachEvent("on" + eventType, callback); // 后绑定的先执行
    } else {
        target.addEventListener(eventType, callback, false);// 捕获
    }
}

// 获取鼠标相对特定元素左上角位置

export let position = function (target, event) {

    // 如果给的直接是数据，返回即可
    if (event.type == 'result') return {
        x: event.position.left,
        y: event.position.top
    };

    // 返回元素的大小及其相对于视口的位置
    let bounding = target.getBoundingClientRect();

    return {

        // 鼠标相对元素位置 = 鼠标相对窗口坐标 - 元素相对窗口坐标
        "x": event.clientX - bounding.left,
        "y": event.clientY - bounding.top
    };
};
