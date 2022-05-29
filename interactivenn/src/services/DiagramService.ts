class DiagramService {
// This class should handle all diagram-related actions
// it should remove current diagram and append a new updated diagram or change the current svg
// depending on the type of the task.

    public exportSVG=()=>{}

    public exportPNG=()=>{}

    private loadSvgFromFile=()=>{} // load or append svg to a html element? would be used in the VennDiagram.tsx component

    public updateDiagramColor=()=>{} // update colors of shape(s)
    
    public updateDiagramOpacity=()=>{}
    
    public updateDiagramFont=()=>{}

    public updateDiagramUnions=()=>{} // given a diagram with sets, update the unions... load the correct diagram with this.loadSvgFromFile()
}

export default new DiagramService();