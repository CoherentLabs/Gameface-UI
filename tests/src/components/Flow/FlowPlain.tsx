/** An overlay without a flow of its own. Its second element shares the screen's first focus id. */
const FlowPlain = () => (
    <div class="flow-row flow-plain">
        <div class="flow-btn flow-plain-first" tabindex="0">Plain first</div>
        <div attr:data-gf-id="flowbtn2" class="flow-btn flow-plain-second" tabindex="0">Plain second (id flowbtn2)</div>
    </div>
);

export default FlowPlain;
