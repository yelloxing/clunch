import { option } from "./option";
import { reuseSeriesOptions } from "./define-object/reuseSeriesOptions";

declare class Clunch {

    // 构造函数
    constructor(option: option);

    /**
     * 挂载对象
     * @param el 挂载点
     */
    $mount(el: Element): this;

    /**
     * 解除挂载
     */
    $unmount(): this;

    /**
     * 主动更新画布大小
     */
    $resize(): this;

    /**
     * 销毁对象
     */
    $destroy(): this;

    /**
    * 绑定事件
    */
    $bind(eventName: string, callback: Function): this;

    /**
     * 图形复用
     */
    $reuseSeriesLink(seriesName: string, options: reuseSeriesOptions): this;

    /**
     * 挂载的新图形
     */
    public static series(): Clunch;

}

export default Clunch;
