/**
 * Data that describes all the settings
 */
export default {
	project: {
		name: {
			label: `Project name`,
			i18n: 'ui:ProjectName',
			description: `Name for this project. Can be different than the Font or Font Family name. Also, this will be used as the name of the saved Glyphr Studio Project (.gs2) file.`,
			descriptionI18n: 'ui:ProjectNameTips',
		},
		latestVersion: {
			label: `Version`,
			i18n: 'ui:Version',
			description: `The latest app version that edited this project file.`,
			descriptionI18n: 'ui:VersionTips',
			type: `Read only`,
			typeI18n: 'ui:ReadOnly',
		},
		initialVersion: {
			label: `Initial version`,
			i18n: 'ui:InitialVersion',
			description: `The app version this project file was first created with.`,
			descriptionI18n: 'ui:InitialVersionTips',
			type: `Read only`,
			typeI18n: 'ui:ReadOnly',
		},
		id: {
			label: `Project ID`,
			i18n: 'ui:ProjectID',
			description: `A unique ID used to identify this project.`,
			descriptionI18n: 'ui:ProjectIDTips',
			type: `Read only`,
			typeI18n: 'ui:ReadOnly',
		},
	},
	font: {
		family: {
			label: `Font family`,
			i18n: 'ui:FontFamily',
			description: `Base font family name, that will be shared across font styles. This will also be used as the base name for exported font files.`,
			descriptionI18n: 'ui:font.FontFamilyDescription',
		},
		style: {
			label: `Font style`,
			i18n: 'ui:font.FontStyle',
			description: `Describes this font within the overall font family. Usually a combination of how bold this font is and if it is italic.`,
			descriptionI18n: 'ui:font.FontStyleDescription',
			example: `Thin, ExtraLight, Light, <strong>Regular</strong>, Medium, SemiBold, <strong>Bold</strong>, ExtraBold, Black <br><br>Thin&nbsp;Italic, ExtraLight&nbsp;Italic, Light&nbsp;Italic, <strong>Italic</strong>, Medium&nbsp;Italic, SemiBold&nbsp;Italic, Bold&nbsp;Italic, ExtraBold&nbsp;Italic, Black&nbsp;Italic`,
			exampleI18n: 'ui:font.FontStyleExample',
		},
		version: {
			label: `Font version`,
			i18n: 'ui:font.FontVersion',
			description: `If this font gets updates regularly, keep track of what version this iteration is. This is recommended to be in Semantic Versioning format, you can learn more at <a href="https://semver.org/" target="_blank">semver.org</a>.`,
			descriptionI18n: 'ui:font.FontVersionDescription',
			example: `Version 1.0`,
			exampleI18n: 'ui:font.FontVersionExample',
		},
		description: {
			label: `Font description`,
			i18n: 'ui:font.FontDescription',
			description: `Open-ended text to describe your font.`,
			descriptionI18n: 'ui:font.FontDescriptionDescription',
		},
		panose: {
			label: `Panose-1`,
			i18n: 'ui:font.Panose1',
			description: `PANOSE is a system that uses ten digits to describe the font's visual style.  A good overview can be found on Monotype's GitHub page: <a href="https://monotype.github.io/panose/pan1.htm" target="_blank">monotype.github.io/panose/pan2.htm</a><br>Each digit of the ten digits is separated by a space, and has a special meaning based on its position.`,
			descriptionI18n: 'ui:font.Panose1Description',
			example: `<strong>0 0 0 0 0 0 0 0 0 0</strong><br>All zeros describe this font as 'any', which basically leaves it undefined. Use this as your default.
			<br><br>
			<strong>2 0 0 0 0 0 0 0 0 0</strong><br>The first digit determines the kind of font family this is, where digit 2 represents Latin typefaces.
			<br><br>
			Check out the interactive PANOSE builder to get more details on what each digit means.`,
			exampleI18n: 'ui:font.Panose1Example',
		},
		upm: {
			label: `Units per Em (UPM)`,
			i18n: 'ui:font.UPM',
			description: `UPM is the measure of the overall design space for a character in this font. Think of UPM like how many pixels of height you have to work with for each character.<br><br><b>Note!</b> Operating systems are picky about what UPM values they allow. In general, anything 1000 or below will work. Above 1000, many times only powers of 2 will work (like 1024, 2048, 4096, etc.).<br><br>Traditionally, UPM is either 1000 or 2048.`,
			descriptionI18n: 'ui:font.UPMDescription',
			example: `1000, 2048`,
			exampleI18n: 'ui:font.UPMExample',
			type: `Em`,
		},
		ascent: {
			label: `Ascent`,
			i18n: 'ui:font.Ascent',
			description: `Distance from the baseline to the top of square and tall lowercase letters (Like: b d h k l).`,
			descriptionI18n: 'ui:font.AscentDescription',
			type: `Em`,
		},
		descent: {
			label: `Descent`,
			i18n: 'ui:font.Descent',
			description: `Distance from the baseline to the bottom of letters that have square descenders (Like: p q y depending on style). This is expressed as a negative number.`,
			descriptionI18n: 'ui:font.DescentDescription',
			type: `Em`,
		},
		capHeight: {
			label: `Capital letter height`,
			i18n: 'ui:font.CapitalLetterHeight',
			description: `Distance from the baseline to the top of square capital letters (Like: A B D E F H I K L M N P R T U V W X Y Z). Usually this is slightly smaller than the ascent.`,
			descriptionI18n: 'ui:font.CapitalLetterHeightDescription',
			type: `Em`,
		},
		xHeight: {
			label: `X height`,
			i18n: 'ui:font.XHeight',
			description: `Distance from the baseline to the top of square lowercase letters (Like: v w x z).`,
			descriptionI18n: 'ui:font.XHeightDescription',
			type: `Em`,
		},
		overshoot: {
			label: `Overshoot`,
			i18n: 'ui:font.Overshoot',
			description: `Rounded characters are usually slightly larger than square characters to compensate for visual weight. For example, a lowercase 'o' will extend slightly above and below a lowercase 'x'. Overshoot is the measure of this distance.`,
			descriptionI18n: 'ui:font.OvershootDescription',
			type: `Em`,
		},
		lineGap: {
			label: `Line gap`,
			i18n: 'ui:font.LineGap',
			description: `When text wraps onto multiple lines, this is the distance between the bottom of one Em Square to the top of the next line's Em Square.`,
			descriptionI18n: 'ui:font.LineGapDescription',
			type: `Em`,
		},
		weight: {
			label: `Font weight`,
			i18n: 'ui:font.FontWeight',
			description: `How bold this font is - a number between 100 and 900:
				<br>100 : Thin
				<br>200 : Extra-Light
				<br>300 : Light
				<br>400 : Regular
				<br>500 : Medium
				<br>600 : Semi-Bold
				<br>700 : Bold
				<br>800 : Extra-Bold
				<br>900 : Black
			`,
			descriptionI18n: 'ui:font.FontWeightDescription',
			type: `Number`,
			typeI18n: 'ui:Number',
		},
		italicAngle: {
			label: `Italic angle`,
			i18n: 'ui:font.ItalicAngle',
			description: `Most common degree of slant for glyphs in an italic font.`,
			descriptionI18n: 'ui:font.ItalicAngleDescription',
			type: `Degree`,
			typeI18n: 'ui:Degree',
		},
		designer: {
			label: `Designer`,
			i18n: 'ui:font.Designer',
			description: 'Person or team who created this font.',
			descriptionI18n: 'ui:font.DesignerDescription',
		},
		designerURL: { label: `Designer's URL`, i18n: 'ui:font.designerURL', description: '' },
		manufacturer: {
			label: `Manufacturer`,
			i18n: 'ui:font.manufacturer',
			description: 'Company who created this font.',
			descriptionI18n: 'ui:font.manufacturerDescription',
		},
		manufacturerURL: {
			label: `Manufacturer's URL`,
			i18n: 'ui:font.manufacturerURL',
			description: '',
		},
		license: {
			label: `License`,
			i18n: 'ui:font.license',
			description: 'License under which this font is released.',
			descriptionI18n: 'ui:font.licenseDescription',
		},
		licenseURL: { label: `License URL`, i18n: 'ui:font.licenseURL', description: '' },
		copyright: { label: `Copyright`, i18n: 'ui:font.copyright', description: '' },
		trademark: { label: `Trademark`, i18n: 'ui:font.trademark', description: '' },
		variant: {
			label: `Font variant`,
			i18n: 'ui:font.variant',
			description: "Either 'normal' or 'small-caps'.",
			descriptionI18n: 'ui:font.variantDescription',
		},
		stretch: {
			label: `Font stretch`,
			i18n: 'ui:font.stretch',
			description: `How condensed or expanded this font is.`,
			descriptionI18n: 'ui:font.stretchDescription',
			example: `normal, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded`,
			exampleI18n: 'ui:font.stretchExample',
		},
		stemv: {
			label: `Vertical stem`,
			i18n: 'ui:font.stemv',
			description: `Most common width measurement of vertical stems in this font.`,
			descriptionI18n: 'ui:font.stemvDescription',
			type: `Em`,
		},
		stemh: {
			label: `Horizontal stem`,
			i18n: 'ui:font.stemh',
			description: `Most common height measurement of horizontal stems in this font.`,
			descriptionI18n: 'ui:font.stemhDescription',
			type: `Em`,
		},
		slope: {
			label: `Slope`,
			i18n: 'ui:font.slope',
			description: `The angle, in degrees counterclockwise from the vertical, of the dominant vertical strokes of the font. The value is negative for fonts that slope to the right.`,
			descriptionI18n: 'ui:font.slopeDescription',
			type: `Degree`,
			typeI18n: 'ui:Degree',
		},
		underlinePosition: {
			label: `Underline position`,
			i18n: 'ui:font.underlinePosition',
			description: `The ideal position of an underline with relation to the baseline (probably should be negative).`,
			descriptionI18n: 'ui:font.underlinePositionDescription',
			type: `Em`,
		},
		underlineThickness: {
			label: `Underline thickness`,
			i18n: 'ui:font.underlineThickness',
			description: `The ideal height of an underline.`,
			descriptionI18n: 'ui:font.underlineThicknessDescription',
			type: `Em`,
		},
		strikethroughPosition: {
			label: `Strikethrough position`,
			i18n: 'ui:font.strikethroughPosition',
			description: `The ideal position of a strikethrough with relation to the baseline.`,
			descriptionI18n: 'ui:font.strikethroughPositionDescription',
			type: `Em`,
		},
		strikethroughThickness: {
			label: `Strikethrough thickness`,
			i18n: 'ui:font.strikethroughThickness',
			description: `The ideal height of a strikethrough.`,
			descriptionI18n: 'ui:font.strikethroughThicknessDescription',
			type: `Em`,
		},
		overlinePosition: {
			label: `Overline position`,
			i18n: 'ui:font.overlinePosition',
			description: `The ideal position of an overline with relation to the baseline.`,
			descriptionI18n: 'ui:font.overlinePositionDescription',
			type: `Em`,
		},
		overlineThickness: {
			label: `Overline thickness`,
			i18n: 'ui:font.overlineThickness',
			description: `The ideal height of an overline.`,
			descriptionI18n: 'ui:font.overlineThicknessDescription',
			type: `Em`,
		},
	},
	app: {
		stopPageNavigation: {
			label: `Warn about unsaved changes on window close`,
			i18n: 'ui:app.stopPageNavigation',
			description: `This will stop closing the window or tab with an "Are you sure?" message if you have unsaved changes.`,
			descriptionI18n: 'ui:app.stopPageNavigationDescription',
			type: `Boolean`,
			typeI18n: 'ui:Boolean',
		},
		formatSaveFile: {
			label: `Format project file for reading`,
			i18n: 'ui:app.formatSaveFile',
			description: `Glyphr Studio Project files (.gs2) are text files in JSON format. By default, this file is saved to optimize for smaller file size. Setting this option to true formats the file to be more easily read by a human, but could increase the file size by 2x or more.`,
			descriptionI18n: 'ui:app.formatSaveFileDescription',
			type: `Boolean`,
			typeI18n: 'ui:Boolean',
		},
		saveLivePreviews: {
			label: `Save live previews`,
			i18n: 'ui:app.saveLivePreviews',
			description: `Save the text blocks that you have defined for your Live Previews (both the page, and the 2nd window). These could be long, so you may want to turn them off for file size reasons.`,
			descriptionI18n: 'ui:app.saveLivePreviewsDescription',
			type: `Boolean`,
			typeI18n: 'ui:Boolean',
		},
		autoSave: {
			label: `Auto-save a copy of the project with each change`,
			i18n: 'ui:app.autoSave',
			description: `When enabled, this option will use your browser's local storage to keep backups. These backups can be restored from the Open Projects page. Your browser's local storage is confined to this browser on this computer. If you use Glyphr Studio from another browser or on another computer, those backups will be available from there.`,
			descriptionI18n: 'ui:app.autoSaveDescription',
			type: `Boolean`,
			typeI18n: 'ui:Boolean',
		},
		savePreferences: {
			label: `Save app preferences locally`,
			i18n: 'ui:app.savePreferences',
			description: `App preferences can be saved locally to your computer, then loaded automatically when you come back to this project.`,
			descriptionI18n: 'ui:app.savePreferencesDescription',
			type: `Boolean`,
			typeI18n: 'ui:Boolean',
		},
		unlinkComponentInstances: {
			label: `Unlink component instances when deleting their root`,
			i18n: 'ui:app.unlinkComponentInstances',
			description: `When selected, this option will unlink component instances and turn them into normal paths if their component root is deleted (the glyph will look the same, but some component instances will end up as stand-alone path objects).<br>If this option is unselected, component instances will be deleted when their component root is deleted (the glyph will look different because it will have less shapes).`,
			descriptionI18n: 'ui:app.unlinkComponentInstancesDescription',
			type: `Boolean`,
			typeI18n: 'ui:Boolean',
		},
		showNonCharPoints: {
			label: `Show non-graphic control characters`,
			i18n: 'ui:app.showNonCharPoints',
			description: `Show the Unicode code points represent things that aren't letters. In Unicode, the C0 and C1 control code or control character sets define control codes for use in text by computer systems that use ASCII and derivatives of ASCII.<br><br>This setting should probably stay turned off, control characters can probably be safely ignored.`,
			descriptionI18n: 'ui:app.showNonCharPointsDescription',
			type: `Boolean`,
			typeI18n: 'ui:Boolean',
		},
		itemChooserPageSize: {
			label: `Number of items to show in the chooser`,
			i18n: 'ui:app.itemChooserPageSize',
			description: `For Ligatures, Components, and Kern Groups, this is how many items to show in the chooser menu. For projects with large numbers of items, splitting the items apart into pages can help the UI perform better.`,
			descriptionI18n: 'ui:app.itemChooserPageSizeDescription',
			type: `Number`,
			typeI18n: 'ui:Number',
		},
		previewText: {
			label: `Project preview text`,
			i18n: 'ui:app.previewText',
			description: `What text to show when previewing a project or switching between projects. If left blank, the string 'Aa Bb Cc Xx Yy Zz' will be used.`,
			descriptionI18n: 'ui:app.previewTextDescription',
		},
		exportLigatures: {
			label: `Export Ligatures to fonts (.otf and .svg)`,
			i18n: 'ui:app.exportLigatures',
			description: `Uncheck this option if don't want ligature data exported to fonts.`,
			descriptionI18n: 'ui:app.exportLigaturesDescription',
			type: `Boolean`,
			typeI18n: 'ui:Boolean',
		},
		exportKerning: {
			label: `Export Kern information to fonts (.svg only)`,
			i18n: 'ui:app.exportKerning',
			description: `Uncheck this option if don't want kern data exported to fonts.`,
			descriptionI18n: 'ui:app.exportKerningDescription',
			type: `Boolean`,
			typeI18n: 'ui:Boolean',
		},
		exportUneditedItems: {
			label: `Export items that were created, but not edited`,
			i18n: 'ui:app.exportUneditedItems',
			description: `When you create a Ligature or Component, or navigate to a Character, an empty glyph item is created
			for you. It's possible to leave these items in an unedited state, essentially empty.<br><br>
			If this option is checked, these empty items will be exported to fonts. If this option is unchecked,
			these empty items will be filtered out, and not exported to fonts.<br><br>
			In the glyph chooser, these empty items' names are shown in a green color.`,
			descriptionI18n: 'ui:app.exportUneditedItemsDescription',
			type: `Boolean`,
			typeI18n: 'ui:Boolean',
		},
		moveShapesOnSVGDragDrop: {
			label: `Move shapes when drag+dropping an SVG file`,
			i18n: 'ui:app.moveShapesOnSVGDragDrop',
			description: `When importing SVG by dragging and dropping a .svg file onto the canvas, move the imported shapes to the origin (x = 0, y = shapes height).`,
			descriptionI18n: 'ui:app.moveShapesOnSVGDragDropDescription',
			type: `Boolean`,
			typeI18n: 'ui:Boolean',
		},
	},
};
