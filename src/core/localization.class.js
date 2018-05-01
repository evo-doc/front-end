"use strict";

const config = require("app.config");
const Storage = require("storage.module");

class Localization {
	/**
	 * @summary Create a localization interface
	 * @description Provides an interface for all localization requests.
	 * @class
	 *
	 * @returns {Localization} Localization instance
	 *
	 * @example <caption>Singleton instance in APP</caption>
	 * APP.getLocalization();
	 *
	 * @example <caption>Get localization file for a route</caption>
	 * let object = APP.getLocalization().getLocalization();
	 *
	 * @example <caption>Get Phrase</caption>
	 * let pharse = APP.getLocalization().getPhrase("namespace", "key");
	 */
	constructor() {
		this._localizations = {};
		this._localizationDefault = "";
		this._localizationUser = "";
		this._storage = null;
	}

	/**
	 * @summary Localization initialization
	 * @description Loads local localizations (explicitly set in `localization.js`). Loads and verifies default localization. Loads and verifies user localization from the storage. If the saved localization does not exist, resets user localization to the default (+ storage value).
	 */
	init() {
		// Load localization
		this._localizations = require("localization.js");
		log.trace(`Loaded localizations: ${Object.keys(this._localizations).join(", ")}`);

		// Check default l10n
		this._localizationDefault = config.localization.default;
		if (Object.keys(this._localizations).indexOf(this._localizationDefault) === -1) {
			log.error(`Cannot find default localization [${this._localizationDefault}] file.`);
		}

		// Load or create user l10n settings
		this._storage = new Storage("localization", {
			userLocalization: this._localizationDefault
		});

		// Load user l10n
		try {
			this._localizationUser = this._storage.getData("userLocalization");
		} catch (e) {
			this._localizationUser = this._storage.setData(
				"userLocalization",
				this._localizationDefault
			);
		}
		log.trace(`User localization: ${this._localizationUser}`);

		// Check user l10n (± resest to the default)
		if (Object.keys(this._localizations).indexOf(this._localizationUser) === -1) {
			log.warn(`Cannot find user l10n [${this._localizationUser}].`);
			this._storage.setData("userLocalization", this._localizationDefault);
			log.warn(`User l10n is reset to [${this._localizationDefault}].`);
		}
	}

	/**
	 * @summary Changes user localization
	 * @description Tries to change user language and save it to the storage. Sets default language if an error
	 * @throws {LocalizationError} Localization must exist
	 */
	changeUserLocalization(localization) {
		// Check language OR set default
		if (Object.keys(this._localizations).indexOf(localization) === -1) {
			log.error(
				`Localization change: requested localization [${localization}] not found. User localization is set to default`
			);
			this._storage.setData("userLocalization", this._localizationDefault);
			throw new error.LocalizationError(localization);
		}

		// Save new language
		this._localizationUser = localization;
		this._storage.setData("userLocalization", this._localizationUser);

		// Reload page
		APP.getRequest().reload();
		return true;
	}

	/**
	 * @summary Get phrase of the current localization
	 * @description Tries to get phrase from the current localization. If requested localization does not have the phrase, tries to return the phrase from the default localization or placeholder;
	 *
	 * @returns {object} Localization object with all phrases
	 */
	getPhrase(namespace, key) {
		try {
			// Try user language
			return this._findPhrase(this._localizationUser, namespace, key);
		} catch (e1) {
			try {
				// Try default language
				return this._findPhrase(this._localizationDefault, namespace, key);
			} catch (e2) {
				// Placeholder
				return config.localization.placeholder;
			}
		}
	}

	/**
	 * @summary Get current localization with all phrases
	 * @description Tries to get localization. If required localization does not exist, tries to return default localization or empty object;
	 *
	 * @returns {object} Localization object with all phrases
	 */
	getPhrases() {
		try {
			// Try user language
			return this._findLocalization(this._localizationUser);
		} catch (e) {
			try {
				// Try default language
				return this._findLocalization(this._localizationUser);
			} catch (e) {
				// Placeholder
				return {};
			}
		}
	}

	/**
	 * @summary Find phrase and return its value
	 * @description Tries to find a phrase within requested localization.
	 * @throws {LocalizationError} Localization must exist
	 * @throws {PhraseError} Phrase must exist
	 * @private
	 *
	 * @param {string} language - Language
	 * @param {string} namespace - Namespace
	 * @param {string} key - Key
	 * @return {string} Phrase
	 */
	_findPhrase(l10n, namespace, key) {
		if (this._localizations[l10n] === undefined) {
			throw new error.LocalizationError(l10n);
		}
		if (this._localizations[l10n][namespace] === undefined) {
			throw new error.PhraseError(l10n, namespace, key);
		}
		if (this._localizations[l10n][namespace][key] === undefined) {
			throw new error.PhraseError(l10n, namespace, key);
		}
		return this._localizations[l10n][namespace][key];
	}

	/**
	 * @summary Find localization and return its object
	 * @description Tries to find a localization within all required localizations and return its object with all phrases.
	 * @throws {LocalizationError} Localization must exist
	 * @private
	 *
	 * @param {string} l10n - Language
	 * @return {object} Localization
	 */
	_findLocalization(l10n) {
		if (this._localizations[l10n] === undefined) throw new error.LocalizationError(l10n);
		return this._localizations[l10n];
	}
}

module.exports = Localization;
