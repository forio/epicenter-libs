import './config';
import { authAdapter, runAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';

const session = authAdapter.getLocalSession();
const unauthedEl = document.getElementById('unauthed');


const initialize = () => {
    const scope = {
        scopeBoundary: SCOPE_BOUNDARY.GROUP,
        scopeKey: session.groupKey,
    };
    
    (function getWithStrategy() {
        const responseDump = document.getElementById('response-dumps');
        const currentRes = document.getElementById('current-res');
        const previousRes = document.getElementById('previous-res');
        const radioGroup = document.getElementById('select-strategy');
        const getRunButton = document.getElementById('get-run-with-strategy');
    
        let strategyResponses = [];
    
        const getRunWithStrategy = async() => {
            responseDump.classList.add('loading');
            const strategy = radioGroup.querySelector(':checked').value;
    
            const res = await runAdapter.getWithStrategy(strategy, 'model.xlsx', scope);
    
            strategyResponses.unshift({ strategy, res });
    
            [currentRes, previousRes].forEach((el, i) => {
                const call = strategyResponses[i];
                if (!call) return;
                const summary = [
                    `<b>Strategy:</b>&nbsp;${call.strategy}`,
                    `<b>runKey:</b>&nbsp;${call.res.runKey}`,
                    `<b>created</b>:&nbsp;${call.res.created}`,
                ].join('<br />');
                el.querySelector('p.summary').innerHTML = summary;
                el.querySelector('details pre').innerHTML = JSON.stringify(call.res, null, 2);
                el.classList.remove('no-content');
            });
            strategyResponses = strategyResponses.slice(0, 1);
            responseDump.classList.remove('loading');
        };
        getRunButton.addEventListener('click', getRunWithStrategy);
    }());
};


if (!session) {
    unauthedEl.classList.remove('hidden');
} else {
    initialize();
}