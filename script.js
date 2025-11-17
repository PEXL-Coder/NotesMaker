// Default to the first template if nothing is selected
window.addEventListener('DOMContentLoaded', () => {
    if (!location.hash) location.hash = '#support-billing';
    updateNotes();
});

// Update whenever the user types change or the user types
window.addEventListener('hashchange', updateNotes);
document.querySelector('.form-area').addEventListener('input', updateNotes);
document.querySelector('.form-area').addEventListener('change', updateNotes);

function updateNotes() {
    const activeId = location.hash ? location.hash.substring(1) : 'support-billing';
    const activeTemplate = document.getElementById(activeId);

    const output = document.getElementById('output');
    if (!activeTemplate || !activeTemplate.classList.contains('template')) {
        output.value = '← Select a call type from the sidebar to begin';
        return;
    }

    let notes = activeTemplate.querySelector('h2').innerText + '\n';
    notes += 'Generated: ' + new Date().toLocaleString('en-ZA') + '\n\n';

    // Optional fixed text block (use <pre class="fixed-text"> if you want fixed lines)
    const fixed = activeTemplate.querySelector('.fixed-text');
    if (fixed) notes += fixed.textContent + '\n\n';

    document.querySelectorAll('.field').forEach(field => {
        const labelEl = field.querySelector('label');
        if (!labelEl) return;
        let label = labelEl.innerText.trim();
        if (label.endsWith(':')) label = label.slice(0, -1);

        let values = [];

        // Text / textarea
        const textInput = field.querySelector('input[type="text"], textarea:not(.additional)');
        if (textInput && textInput.value.trim() !== '') && values.push(textInput.value.trim());

        // Select
        const select = field.querySelector('select');
        if (select && select.selectedIndex > 0) {
            values.push(select.options[select.selectedIndex].text.trim());
        }

        // Radios & checkboxes
        const checked = field.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
        checked.forEach(cb => {
            const lbl = cb.parentNode; // <label><input ...> Text</label>
            values.push(lbl.textContent.trim());
        });

        if (values.length > 0) {
            notes += `${label}: ${values.join(', ')}\n`;
        }
    });

    // Additional notes (always at the end)
    const additional = activeTemplate.querySelector('textarea.additional');
    if (additional && additional.value.trim()) {
        notes += '\nAdditional Notes:\n' + additional.value.trim();
    }

    output.value = notes.trim();
}

// Copy to clipboard
document.getElementById('copy-button').addEventListener('click', () => {
    const output = document.getElementById('output');
    output.select();
    navigator.clipboard.writeText(output.value).then(() => {
        const fb = document.getElementById('copy-feedback');
        fb.style.display = 'block';
        setTimeout(() => fb.style.display = 'none', 2000);
    }).catch(() => alert('Copy failed – please select and copy manually'));
});
