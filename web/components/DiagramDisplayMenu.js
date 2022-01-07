export function DisplayMenu({ diagramConfig, handleReset, handleSetDiagramConfig }) {
  const element = React.createElement;

    /**
     * @description Increases the font-size of texts by 1.
     */
    function fontsizeup() {
      if (diagramConfig.fontSize < 60) {
        handleSetDiagramConfig({ fontSize: diagramConfig.fontSize + 1 });
      }
    }

    /**
    * @description Decreases the font-size of texts by 1.
    */
    function fontsizedown() {
      if (diagramConfig.fontSize > 5) {
        handleSetDiagramConfig({ fontSize: diagramConfig.fontSize - 1 });
      }
    }

    /**
    * @description Increases the global opacity of the diagram.
    */
    function opacityUp() {
      const currentOpacity = diagramConfig.opacity;
      handleSetDiagramConfig({ opacity: currentOpacity === 0.7 ? currentOpacity : currentOpacity + 0.03});
    }

    /**
    * @description Reduces the global opacity of the diagram.
    */
    function opacityDown() {
      const currentOpacity = diagramConfig.opacity;
      handleSetDiagramConfig({ opacity: currentOpacity <= 0.03 ? currentOpacity : currentOpacity - 0.03});
    }

    /**
    * @description Resets the diagram.
    */
    function resetDiagram() {
      handleReset();
    }

  return (
    element(
      'div',
      null,
      'Font-size: ',
      ButtonElement({ id: 'fontsizedown', content: '-', onClick: () => fontsizedown(diagramConfig) }),
      ButtonElement({ id: 'fontsizeup', content: '+', onClick: () => fontsizeup(diagramConfig) }),
      '| Color-opacity: ',
      ButtonElement({ id: 'opacitydown', content: '-', onClick: () => opacityDown() }),
      ButtonElement({ id: 'opacityup', content: '+', onClick: () => opacityUp(diagramConfig) }),
      ' | ',
      ButtonElement({ id: 'resetButton', type: 'button', content: 'Reset diagram', style: { fontSize: '12px', height: '24px' }, onClick: resetDiagram })
    )
  )
}

function ButtonElement({ id, content, style, onClick }) {
  const element = React.createElement;

  return (
    element(
      'button',
      { id, onClick, style: style ? style : { fontSize: '12px', height: '24px', width: '24px'}, type: 'button'},
      content
    )
  )
}