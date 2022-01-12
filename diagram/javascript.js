// Author Henry Heberle, 2015
// henry at icmc . usp . br
//
// This file is part of InteractiVenn.
//
// InteractiVenn is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// InteractiVenn is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with InteractiVenn. If not, see <http://www.gnu.org/licenses/>.



// Those that have employed the tool InteractiVenn should mention:
//
// Heberle, H.; Meirelles, G. V.; da Silva, F. R.; Telles, G. P.; Minghim, R. InteractiVenn: a web-based tool for the analysis of sets through Venn diagrams. BMC Bioinformatics 16:169 (2015).
// 
// http://doi.org/10.1186/s12859-015-0611-3
// https://bmcbioinformatics.biomedcentral.com/articles/10.1186/s12859-015-0611-3
// http://www.interactivenn.net/
import Diagram from './Diagram.js';


const data = [
    {label: 'Set Number 1', data: [1, 2, 1, 1, 3, 3]},
    {label: 'Set Number 2', data: [2, 3, 4]},
    {label: 'Set Number 3', data: [4, 5, 6]},
    {label: 'Set Number 4', data: [6, 7, 8]}
]
const config = {
    nWay: 5,
    fontSize: 20,
    fontOpacity: 0.9,
    opacity: 0.3,
    showPercentage: true,
    unions: ['ab', 'cd'],
    colors: [],
}
console.log('loading diagram');
const diagram = new Diagram(data, config);
console.log(diagram);