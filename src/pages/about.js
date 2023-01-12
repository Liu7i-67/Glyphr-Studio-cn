import { makeElement } from '../common/dom.js';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { emailLink } from '../app/app.js';
import alphaLogo from '../common/graphics/alpha-logo.svg?raw';

/**
 * Page > About
 * Information about Glyphr Studio
 */
export function makePage_About() {
	const editor = getCurrentProjectEditor();
	const app = window._GlyphrStudioApp;
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="content__page">
			<div class="content-page__left-area">
				<div class="content-page__nav-area">
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'About' })}
				</div>
				<div id="content-page__panel">
					<h3>Helpful links</h3>
					Main site: <br>
					<a href="https://www.glyphrstudio.com" target="_blank">glyphrstudio.com</a>
					<br><br>

					Help for Glyphr Studio v2:<br>
					<a href="https://www.glyphrstudio.com/v2/help" target="_blank">glyphrstudio.com/v2/help</a>
					<br><br>

					Email:<br>
					${emailLink()}
					<br><br>

					Twitter:<br>
					<a href="https://twitter.com/glyphrstudio" target="_blank">@glyphrstudio</a>
					<br><br>

					Blog:<br>
					<a href="http://www.glyphrstudio.com/blog/" target="_blank">glyphrstudio.com/blog</a>
					<br><br>
					<br><br>

					${makeContributeMessage()}


				</div>
			</div>
			<div class="content-page__right-area">
				<div class="GS2Logo">
					${alphaLogo}
				</div>
				<p class="logoNote">*not the final logo!</p>

				<br>
				${makeAlpha1Message()}
				<br>

				<h1>Version information</h1>
				<div class="page__card">
					<h3>Glyphr Studio App</h3>
					<label>Version name:</label> ${app.versionName}<br>
					<label>Version number:</label> ${app.version}<br>
					<label>Last updated on:</label> ${new Date(app.versionDate).toDateString()}.
				</div>

				<div class="page__card">
					<h3>This Glyphr Studio Project</h3>
					<label>Project name:</label> ${editor.project.metadata.name}<br>
					<label>Unique project ID:</label> ${editor.project.metadata.id}<br>
					<label>Initially created with:</label> Version ${editor.project.metadata.initialVersion}</span>
				</div>

				<br><br>

				<h1>License</h1>
				<p>
					Glyphr Studio is licensed under a <a href='https://www.gnu.org/licenses/gpl.html' target='_blank'>GNU General Public License</a>,
					which is a free / open source 'copyleft' license. You are free to use, distribute, and modify Glyphr Studio as long as
					this license and its freeness stays intact.
				</p>
				<br><br>

			</div>
		</div>
	`,
	});

	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	return content;
}

export function makeAlpha1Message() {
	const app = window._GlyphrStudioApp;
	let content = `
		<h1>Welcome to Alpha-1!</h1>
		<p>
			What is an alpha? Currently, Glyphr Studio v2 does not
			have enough features to be considered a usable product (mainly, it's missing
			importing/exporting font files, and opening/saving project files). But, there
			are still some features that we'd love to get feedback on, and probably some
			bugs that we still haven't found.
		</p>
		<br>
		<h3>
			There is a ton of information over on the blog:<br>
			<a href="https://www.glyphrstudio.com/blog/?p=288" target="_blank">V2 Alpha-1 MEGA POST</a>
		</h3>
		<br>
		<b>For Alpha-1, please try the following scenarios:</b>
		<ul>
			<li>Navigate around using the upper-left Page Chooser, Glyph Chooser, and Panel Chooser</li>
			<li>Resize paths with the arrow tool and edit paths with the pen tool</li>
			<li>Create new shapes on the edit canvas</li>
			<li>Edit glyph, path, and path point details from the Attributes panel</li>
			<li>Copy and paste paths</li>
			<li>Undo edits</li>
		</ul>

		<br>
		<p>
			If you find any bugs, or have an suggestions about functionality, please email us!
			${emailLink()}
		</p>
	`;
	return content;
}

export function makeContributeMessage() {
	let content = `
	<h3>Contribute!</h3>
	If you think Glyphr Studio is pretty cool, there are two huge ways you can make it better!
	<br>
	<ul>
		<li>
			<b>Send Feedback</b> -
			Use new features and let us know if you run into issues.  Follow us on Twitter and read the Blog,
			and participate in discussions.	Be vocal, and let us know what we should do next!
			<br>
		</li>
		<li>
			<b>Make a Monetary Contribution</b> -
			Glyphr Studio will always be free, and we think that is very important.  But, it does take some
			money to keep it going.	Contributions of even small amounts of money help keep the Glyphr Studio
			effort going strong!
			<br><br>
		</li>
	</ul>

	<a href='https://ko-fi.com/C0C1FD091' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
	&nbsp;
	<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=AZWAY69KRNUJW" target="_blank">
		<img alt="PayPal - The safer, easier way to pay online!" height='36' style='border:0px;height:36px;' src="data:image/png;base64,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"/>
	</a>
	`;

	return content;
}
