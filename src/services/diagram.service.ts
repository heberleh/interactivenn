/**
 * Manage the creation of diagrams, based on sets and a list of unions.
 * 
 * To use this service, import it and call the functions.
 * E.g.,
 *       import diagramService from "./diagram.service";
 *       diagramService.appendDiagram(div, sets, unions);
 */

import setsService from "./sets.service";

class DiagramService{

    /**
     * 
     * @param div The div element to which the SVG element will be appended.
     * @param sets The list of sets that will be represented by the diagram.
     * @param unions The list of union operations (e.g., [[1,2],[3,4]]). Initially I used A, B, C... 
     *               but it makes more sente to manage with integer in a list of sets.
     *               For now, i will let unions as a set of strings, because it is how it is currently implemented,
     *               in the form ["ab","cd"], which is entered by the user in this format "ab,cd" in the graphic interface.
     */
    public appendDiagram(div: HTMLDivElement, sets:Set<string>[], unions: string[]){
        // set up sets based on unions
        // setsService.union...

        // compute intersections (call setsService)
        // setsService.intersect...

        // load correct diagram based on unions and number of sets... e.g., 4waydiagram_ac_bd.svg

        // create new div, append the svg
        // update labels
        
        // set mouse-over events
        
        // append div-diagram to the main-div passed to this function
    }

}

export default new DiagramService();