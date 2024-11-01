/* eslint-disable camelcase */
/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	BaseControl,
	Button,
	ExternalLink,
	PanelBody,
	PanelRow,
	Placeholder,
	Spinner,
	ToggleControl,
} = wp.components;

const {
	render,
	Component,
	Fragment
} = wp.element;

const axios = require('axios').default;


/**
 * Internal dependencies
 */
import './style.scss';

class App extends Component {
	constructor() {
		super(...arguments);

		this.changeOptions = this.changeOptions.bind(this);

		this.state = {
			isAPILoaded: false,
			isAPISaving: false,
			codeinwp_analytics_status: false,
			codeinwp_analytics_key: '',
			last_updated: '',
			theintAfterCartTable: true,
			theintAfterCart: false,
			intelligentCartNumber: 3,
			theintAfterCheckout: true,
			intelligentCheckoutNumber: 3,
			theintelligent_after_cart_table_title: '',
			theintelligent_exclude_out_of_stock: '',
			theintelligent_related_products: '',
		};
	}

	componentDidMount() {
		wp.api.loadPromise.then(() => {
			this.settings = new wp.api.models.Settings();

			// console.log(this);
			if (false === this.state.isAPILoaded) {
				this.settings.fetch().then(response => {
					//console.log( response );
					this.setState({
						last_updated: response.last_updated ? response.last_updated : new Date().toLocaleString(),
						isAPILoaded: true,
						theintAfterCartTable: response.theintAfterCartTable,
						theintAfterCart: response.theintAfterCart,
						intelligentCartNumber: response.intelligentCartNumber,
						theintAfterCheckout: response.theintAfterCheckout,
						intelligentCheckoutNumber: response.intelligentCheckoutNumber,
						theintelligent_after_cart_table_title: response.theintelligent_after_cart_table_title,
						theintelligent_exclude_out_of_stock: response.theintelligent_exclude_out_of_stock,
						theintelligent_related_products: response.theintelligent_related_products,
					});
				});
			}
		});
	}

	changeOptions(option, value, roles = {}) {

		if (roles.visibilitycontrol) {
			const rolesElm = document.getElementsByClassName(roles.visibilitycontrol);
			rolesElm[0].classList.toggle("theint_hide");
		}

		if (roles.ajax) {
			let data = roles.data ? roles.data : {};
			this.doingAjax(roles.ajax, data);
		}

		this.setState({ isAPISaving: true });

		const model = new wp.api.models.Settings({
			// eslint-disable-next-line camelcase
			[option]: value
		});

		model.save().then(response => {
			this.setState({
				[option]: response[option],
				isAPISaving: false
			});

		});
	}

	doingAjax(action, data = {}) {
		var form_data = new FormData();
		form_data.append('action', action);
		form_data.append('nonce', theint_ja_data.nonce);

		axios.post(theint_ja_data.ajax_url, form_data)
			.then(function (response) {

				if (response.data.success) {
					let statusElm = document.getElementsByClassName('theintUpdateStatus')[0];
					let forceBtn = document.getElementsByClassName('theintFource')[0];

					var status = 'Successfully updated... <a href="/wp-admin/admin.php?page=wc-status&tab=action-scheduler&status=pending&s=theintelligent&action=-1&paged=1&action2=-1">Check progress</a>';

					statusElm.innerHTML = status;
					forceBtn.textContent = 'Updated';
				} else {
					alert(response.data.data);
					return;
				}



			})
			.catch(function (error) {

				alert(error.data);

			});
	}



	render() {
		if (!this.state.isAPILoaded) {
			return (
				<Placeholder>
					<Spinner />
				</Placeholder>
			);
		}

		return (
			<Fragment>
				<div className="theintelligent-header">
					<div className="theintelligent-container">
						<div className="theintelligent-logo">
							<h1>{__('🤖 The Intelligent')}</h1>
						</div>
					</div>
				</div>

				<div className="theintelligent-main">
					<PanelBody>
						<div className="theintelligent-info">
							<h2>{__('AI Matuarity Status')}</h2>

							<p className="theintUpdateStatus">{theint_ja_data.has_suggestions ? '😇 Last updated: ' + theint_ja_data.last_training : '⛔️ Update Required 🥴'}</p>

							<div className="theintelligent-info-button-group">
								<Button
									isPrimary
									isLarge
									className="theintFource"
									disabled={this.state.isAPISaving}
									onClick={() => this.changeOptions(
										'force_update_ai',
										this.state.force_update_ai,
										{
											ajax: 'train_data',
										}
									)}
								>
									{__('Force Update AI')}
								</Button>
							</div>
						</div>
					</PanelBody>

					<PanelBody
						title={__('Display configurations')}
					>

						<PanelRow>
							<ToggleControl
								label={__('After Cart Table')}
								help={'Would you like to show suggessions after cart table?'}
								checked={this.state.theintAfterCartTable}
								onChange={() => this.changeOptions(
									'theintAfterCartTable',
									!this.state.theintAfterCartTable,
									{
										visibilitycontrol: 'intelligentCartNumber'
									}
								)}
							/>
						</PanelRow>

						<PanelRow className={`intelligentCartNumber ${!this.state.theintAfterCartTable ? "theint_hide" : ""}`}>
							<ToggleControl
								label={__('After Cart Proceed Button')}
								help={'Would you like to show suggessions after cart?'}
								checked={this.state.theintAfterCart}
								onChange={() => this.changeOptions(
									'theintAfterCart',
									!this.state.theintAfterCart,
								)}
							/>
						</PanelRow>

						<PanelRow className={`intelligentCartNumber ${!this.state.theintAfterCartTable ? "theint_hide" : ""}`}>
							
							<BaseControl
								label={__('Number of products to show')}
								help={'Specify the number of product after cart.'}
								id="theintelligent-options-intelligentCartNumber"
								className="theintelligent-text-field"

							>
								<input
									type="number"
									id="theintelligent-options-intelligentCartNumber"
									value={this.state.intelligentCartNumber}
									placeholder='3'
									disabled={this.state.isAPISaving}
									onChange={e => this.setState({ intelligentCartNumber: e.target.value })}
								/>

								<Button
									isPrimary
									isLarge
									className="theint-is-primary"
									disabled={this.state.isAPISaving}
									onClick={() => this.changeOptions('intelligentCartNumber', this.state.intelligentCartNumber)}
								>
									{__('Save')}
								</Button>
							</BaseControl>
						</PanelRow>

						<PanelRow>
							<ToggleControl
								label={__('After Checkout')}
								help={'Would you like to show suggessions after checkout?'}
								checked={this.state.theintAfterCheckout}
								onChange={() => this.changeOptions(
									'theintAfterCheckout',
									!this.state.theintAfterCheckout,
									{
										visibilitycontrol: 'intelligentCheckoutNumber'
									}
								)}
							/>
						</PanelRow>
						<PanelRow className={`intelligentCheckoutNumber ${!this.state.theintAfterCheckout ? "theint_hide" : ""}`}>
							<BaseControl
								label={__('Number of products to show')}
								help={'Specify the number of product after checkout.'}
								id="theintelligent-options-intelligentCheckoutNumber"
								className="theintelligent-text-field"

							>
								<input
									type="number"
									id="theintelligent-options-intelligentCheckoutNumber"
									value={this.state.intelligentCheckoutNumber}
									placeholder='3'
									disabled={this.state.isAPISaving}
									onChange={e => this.setState({ intelligentCheckoutNumber: e.target.value })}
								/>
								<Button
									isPrimary
									isLarge
									className="theint-is-primary"
									disabled={this.state.isAPISaving}
									onClick={() => this.changeOptions('intelligentCheckoutNumber', this.state.intelligentCheckoutNumber)}
								>
									{__('Save')}
								</Button>
							</BaseControl>
						</PanelRow>

						<PanelRow>
							<BaseControl
								label={__('Shortcode')}
								help={'Use this shortcde to show suggestions anywhere of your shop.'}
								id="theintelligent-options-intelligentShortcode"
								className="theintelligent-text-field"	
							>
							<p><code>[products theintelligent_suggestions='1']</code></p>
							</BaseControl>
						</PanelRow>

					</PanelBody>

					<PanelBody>
						<PanelRow>
							<BaseControl
								label={__('Title')}
								help={'Title before the suggessions.'}
								id="theintelligent-options-suggession-title"
								className="theintelligent-text-field"
							>
								<input
									type="text"
									id="theintelligent-options-suggession-title"
									value={this.state.theintelligent_after_cart_table_title}
									placeholder={__('You may also buy...')}
									disabled={this.state.isAPISaving}
									onChange={e => this.setState({ theintelligent_after_cart_table_title: e.target.value })}
								/>

								<div className="theintelligent-text-field-button-group">
									<Button
										isPrimary
										isLarge
										className="theint-is-primary"
										disabled={this.state.isAPISaving}
										onClick={() => this.changeOptions('theintelligent_after_cart_table_title', this.state.theintelligent_after_cart_table_title)}
									>
										{__('Save')}
									</Button>
								</div>
							</BaseControl>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={__('Hide the stock out products')}
								checked={this.state.theintelligent_exclude_out_of_stock}
								onChange={() => this.changeOptions('theintelligent_exclude_out_of_stock', !this.state.theintelligent_exclude_out_of_stock)}
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={__('Related products')}
								checked={this.state.theintelligent_related_products}
								onChange={() => this.changeOptions('theintelligent_related_products', !this.state.theintelligent_related_products)}
								help={'Let AI to suggest the best match when user in single product page'}

							/>
						</PanelRow>
					</PanelBody>

					<PanelBody>
						<div className="theintelligent-info">
							<h2>{__('Got a question for us?')}</h2>

							<p>{__('We would love to help you out if you need any help.')}</p>

							<div className="theintelligent-info-button-group">
								<Button
									isDefault
									className="theint_contact_btn"
									isLarge
									target="_blank"
									href="https://exlac.com/contact-us/"
								>
									{__('Ask a question')}
								</Button>

								<Button
									isDefault
									isLarge
									target="_blank"
									href="https://exlac.com/contact-us/"
								>
									{__('Request for a Feature')}
								</Button>
							</div>
						</div>
					</PanelBody>
					
				</div>
			</Fragment>
		);
	}
}

render(
	<App />,
	document.getElementById('theint')
);
