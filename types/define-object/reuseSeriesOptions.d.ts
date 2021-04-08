export interface reuseSeriesOptions {

    /**
     * 表示需要被复用的组件的属性配置
     */
    attr: any

    /**
     * 可选，表示需要被复用的组件的子组件，是一个数组，数组条目的name和attr方便表示子组件的名称和属性配置
     */
    subSeries: Array<{
        name: string
        attr: any
    }>

    /**
     * 可选，文本数组
     */
    texts: Array<string>

}
