function createEventListeners() {
    [...document.getElementsByClassName('start-button')].forEach((element) => {
        element.addEventListener(
            'click',
            () => {
                document.getElementById('home-page-content').classList.toggle('hidden-content');
                document.getElementById('generation-content').classList.toggle('hidden-content');
                initiateGenerator(element.getAttribute('data-gen-type'),element.getAttribute('data-gen-func-name'));
                window.scrollTo(0, 0);
        });
    });

    document.getElementById('back-arrow-p-modes').addEventListener('click', () => {
        document.getElementById('home-page-content').classList.toggle('hidden-content');
        document.getElementById('generation-content').classList.toggle('hidden-content'); 
    });

    document.getElementById('feedback-button').addEventListener('click', () => {
        window.open('https://forms.gle/WecgWERFcqpR4sSEA', '_blank');
        document.getElementById('feedback-button').blur();
    })

    document.getElementById('see-info-button').addEventListener('click', () => {
        document.getElementById('home-page-content').classList.toggle('hidden-content');
        document.getElementById('FAQ-page').classList.toggle('hidden-content');
        window.scrollTo(0, 0);
        document.getElementById('FAQ-content-container').scrollTo(0, 0);
    });

    document.getElementById('back-arrow-FAQ').addEventListener('click', () => {
        document.getElementById('home-page-content').classList.toggle('hidden-content');
        document.getElementById('FAQ-page').classList.toggle('hidden-content'); 
    });

    const QCopyButton = document.getElementById('Q-copy-button');
    const ACopyButton = document.getElementById('A-copy-button');

    QCopyButton.addEventListener('click',() => {
        navigator.clipboard.writeText(document.getElementById('un-rendered-Q').textContent);
        QCopyButton.innerHTML = 'Copied!';
        QCopyButton.setAttribute('data-status','text-was-copied');
        removeCopyMessage(QCopyButton);
    });

    ACopyButton.addEventListener('click',() => {
        navigator.clipboard.writeText(document.getElementById('un-rendered-A').textContent);
        ACopyButton.innerHTML = 'Copied!';
        ACopyButton.setAttribute('data-status','text-was-copied')
        removeCopyMessage(ACopyButton);
    });
}

const loadModule = async (funcName) => {
    const module = await import(`./gen-modules/${funcName}.js`);  
    return module.default;  
};

async function initiateGenerator(type, funcName) {
    document.getElementById("generator-name").innerHTML = type;
    document.querySelectorAll(".output-box").forEach(element => {
        element.removeAttribute("data-special-styles");
        element.setAttribute("data-special-styles", funcName);
    });

    const currentGen = await loadModule(funcName);
    switchToNewQuestion(currentGen());  

    cleanedFromListeners(document.getElementById("generate-button")).addEventListener("click", async () => {
        switchToNewQuestion(currentGen());
    });
}

function cleanedFromListeners(element) {
    const clone = element.cloneNode(true); 
    element.parentNode.replaceChild(clone, element); 
    return clone; 
} // Takes an element, removes all its event listeners, and returns the cleaned element

function switchToNewQuestion(newQuestion) {
    const question = newQuestion.question;
    const answer = newQuestion.answer;
    const TeXquestion = (newQuestion.TeXquestion === undefined) ? newQuestion.question : newQuestion.TeXquestion;
    const TeXanswer = (newQuestion.TeXanswer === undefined) ? newQuestion.answer : newQuestion.TeXanswer;
    
    document.getElementById('rendered-Q').innerHTML = '\\(' + question + '\\)';
    document.getElementById('un-rendered-Q').innerHTML = TeXquestion;
    document.getElementById('rendered-A').innerHTML = '\\(' + answer + '\\)';
    document.getElementById('un-rendered-A').innerHTML = TeXanswer;

    MathJax.typesetPromise([document.getElementById('Q-A-container')]);
} // Regenerate a question and answer and display them

function removeCopyMessage(element) {
    // Clear the existing timeout if it's still pending
    if (element._timeoutId) {
        clearTimeout(element._timeoutId);
    }

    // Set a new timeout and store the ID on the element
    element._timeoutId = setTimeout(() => {
        element.innerHTML = 'Copy LaTeX';
        element.removeAttribute('data-status');
        element._timeoutId = null; // Reset the ID
    }, 2000);
}

function resetStyles(elements) {
    elements.forEach((element) => {
        element.removeAttribute('style');
    });
}

createEventListeners();