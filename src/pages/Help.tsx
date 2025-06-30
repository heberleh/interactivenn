import React from 'react';

const HelpPage: React.FC = () => {
  return (
    <div>
      <h3>Secret data?</h3>
      <p>
        <b style={{ color: '#C74350' }}>Your data stays in your computer</b>. It is not sent through the internet.
        We do not see your data anywhere, we do not receive your data, and naturally, we do not store nor see your data.
        Your data is processed exclusively in your web browser of choice.
        If you are still unsure, no problem, you can still use our tool with confidence by using anonnymous codes,
        for example, instead of writing the name of a gene, write simply a number or a random ID,
        that always represent that same gene. But again, this is not necessary, your data stays in the browser and don&apos;t go anywhere else.
      </p>

      <h3>Building a diagram:</h3>
      <p>
        To <b style={{ color: '#C74350' }}>build a diagram</b>, select the number of
        sets and then fill the lists of elements in each set, one element per
        line. Optionally, fill the name of each set and select its color.
        The diagram will be updated as the set elements are entered, in most
        browsers. If that does not happen, clicking on any other window
        region will trigger the update. Changing the number of sets will
        preserve the element lists.
      </p>

      <h3>Listing the elements in each diagram region:</h3>
      <p>
        To <b style={{ color: '#C74350' }}>list the elements</b> in each nonempty
        diagram region, click on the numeric label of a region. A window
        containing the list of elements in that region will pop-up. If you
        click over multiple regions, multiple windows will be opened.
      </p>

      <h3>Performing set unions:</h3>
      <p>
        Unions of sets may be applied to the sets either through a binary tree
        or through a list of unions.
      </p>
      <p>
        With <b style={{ color: '#C74350' }}>Unions by tree</b>, a tree in Newick
        format has to be given as input. After typing a tree, click on the
        &quot;Start Tree&quot; button. The initial view corresponds to the leaves of
        the tree, where all sets are distinct. Clicking on the &quot;Up&quot; button
        will go up a level in the tree, performing the set unions at that
        level. The diagram shape will not change, but regions will be merged
        and their sizes will reflect such merging. Similarly, clicking on the
        &quot;Down&quot; button will go down a level in the tree. Click &quot;Stop&quot; to
        restore the original diagram. If the tree string given as input is
        malformed, then both Up and Down buttons will be disabled.
      </p>
      <p>
        For instance, with three sets A, B and C, navigating through the
        tree <b>((A,B),C)</b> will show first a diagram where the three sets
        are distinct. Clicking &quot;Up&quot; will show a diagram where A and B are
        merged. Another click on &quot;Up&quot; will show a tree where sets A, B and
        C are merged.
      </p>
      <p>
        After the start of the unions, clicking on the &quot;Visualize tree&quot;
        button will display the tree that was given as input.
      </p>
      <p>
        With <b style={{ color: '#C74350' }}>Unions by list</b>, a colon
        separated list of sets is given as input. After typing a list,
        click on the &quot;Start&quot; button. The initial view corresponds to the
        unions given by the first element in the list. Clicking on the
        &quot;&gt;&quot; button will perform the next union in the list. Similarly,
        Clicking on the &quot;&lt;&quot; button will undo the previous union in the
        list.
      </p>
      <p>
        For instance, with three sets A, B and C, navigating through the
        list <b>;ab;ca</b> will show first a diagram where the three sets
        are distinct. Clicking &quot;&gt;&quot; will show a diagram where only A and B
        are merged. Another click on &quot;&gt;&quot; will show a diagram where A and
        C are merged.
      </p>

      <h3>Changing colors and font size:</h3>
      <p>
        <b style={{ color: '#C74350' }}>Set colors</b>, <b style={{ color: '#C74350' }}>color opacity</b>
        and <b style={{ color: '#C74350' }}>font size</b> may be changed through
        the appropriate controls. The color of a set may be changed
        clicking on the coloured square close to the set name. Font size
        and color opacity may be increased or decreased clicking on the
        respective &quot;+&quot; or &quot;-&quot; buttons. Clicking on &quot;Reset diagram&quot; will
        restore default colors and font size. Set elements will not be
        affected.
      </p>

      <h3>Saving and loading:</h3>
      <p>
        To <b style={{ color: '#C74350' }}>save</b> the sets type a name for a
        file in the field tagged with the phrase &quot;Write dataset name here&quot;
        and click on the &quot;Save&quot; button. The download will start after
        that.
      </p>
      <p>
        To <b style={{ color: '#C74350' }}>load</b> sets previously saved, click
        on the &quot;Browse...&quot; button right below the &quot;Load Sets:&quot; label, and
        then select the appropriate file. The upload will start after
        that, and the sets fill be filled with data.
      </p>

      <h3>Exporting:</h3>
      <p>
        To <b style={{ color: '#C74350' }}>export the diagram</b> in SVG vector
        format, PNG graphic format or text format, type a name for a file in
        the field tagged with the phrase &quot;Write file name here&quot;, right below
        the &quot;Export current diagram:&quot; label, select the desired format and
        click on the &quot;Export&quot; button. The download will start after that.
        The text format has the elements in each nonempty diagram region.
      </p>

      <h3>Example of data sets:</h3>
      <p>The two data sets below were converted to the InteractiVenn&apos;s file format (.ivenn).</p>
      <p>
        <b>Prostate cancer proteomic dataset</b>: <a href="/prostate_dataset.ivenn" download>prostate_dataset.ivenn</a>
      </p>
      <p>
        Reference: Kim, Y., Ignatchenko, V., Yao, C. Q., Kalatskaya, I., Nyalwidhe, J. O.,
        Lance, R. S., … Kislinger, T. (2012, December). Identification of
        differentially expressed proteins in direct expressed prostatic
        secretions of men with organ-confined versus extracapsular prostate
        cancer. Molecular &amp; Cellular Proteomics.
        http://doi.org/10.1074/mcp.M112.017889
      </p>
      <p>
        <b>Musa acuminata dataset</b>: <a href="/banana_dataset.ivenn" download>banana_dataset.ivenn</a>
      </p>
      <p>
        Reference: D’Hont, A., others, Denoeud, F., Aury, J.-M., Baurens, F.-C., Carreel, F.,
        … Wincker, P. (2012). The banana (Musa acuminata) genome and the
        evolution of monocotyledonous plants. Nature, 488(7410), 213–7.
        http://doi.org/10.1038/nature11241
      </p>

      <h3>Source code:</h3>
      <p>
        You can report bugs or contribute to the project here: <a href="https://github.com/heberleh/interactivenn">InteractiVenn @ GitHub</a>
      </p>
    </div>
  );
};

export default HelpPage;
