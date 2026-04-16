import Block from "@components/Layout/Block/Block";
import Column from "@components/Layout/Column/Column";
import Flex from "@components/Layout/Flex/Flex";
import Layout from "@components/Layout/Layout/Layout";
import Row from "@components/Layout/Row/Row";
import TabLink from "@components/Layout/TabLink/TabLink";
import Tabs from "@components/Layout/Tabs/Tabs";
import Tab from "@components/Layout/Tab/Tab";
import { Icon } from "@components/Media/Icon/Icon";
import Grid from "@components/Layout/Grid/Grid";
import Progress from "@components/Feedback/Progress/Progress";
import NumberInput from "@components/Basic/Input/NumberInput/NumberInput";
import Button from "@components/Basic/Button/Button";
import ToggleButton from "@components/Basic/ToggleButton/ToggleButton";
import Dropdown from "@components/Basic/Dropdown/Dropdown";
import Checkbox from "@components/Basic/Checkbox/Checkbox";
import styles from './Inventory.module.scss';
import Relative from "@components/Layout/Relative/Relative";
import Absolute from "@components/Layout/Absolute/Absolute";
import Transform from "@components/Layout/Transform/Transform";

const Inventory = () => {
	return (
		<Tabs default="inventory">
			<Row style={{height: '100%'}}>
				<Column.Two>
						<Flex class={styles.sidebar} direction="column" gap="1rem" align-items="end">
							<TabLink activeClass={styles['tab-link-current']} class={styles['tab-link']} location="inventory">Inventory</TabLink>
							<TabLink activeClass={styles['tab-link-current']} class={styles['tab-link']} location="crafting">Crafting</TabLink>
							<TabLink activeClass={styles['tab-link-current']} class={styles['tab-link']} location="quest-items">Quest Items</TabLink>
							<TabLink activeClass={styles['tab-link-current']} class={styles['tab-link']} location="log">Log</TabLink>
						</Flex>
				</Column.Two>
				<Tab location="inventory">
					<Column.Six>
						<Flex direction="row" class={styles['main-panel']}>

							{/*  Equipped Items */}
							<Flex direction="column" align-items="center" justify-content="space-between" gap="1.375rem" class={styles['equipped-items-wrapper']} >
								<div class={styles['equipped-item']}><Icon.inventory.helmet fill /></div>
								<div class={styles['equipped-item']}><Icon.inventory.breastPlate fill /></div>
								<div class={styles['equipped-item']}><Icon.inventory.pants fill /></div>
								<div class={`${styles['equipped-item']} ${styles['equipped-item-active']}`}><Icon.inventory.boots fill /></div>
								<div class={`${styles['equipped-item']} ${styles['equipped-item-active']}`}><Icon.inventory.sword fill /></div>
								<div class={styles['equipped-item']}><Icon.inventory.shield fill /></div>
							</Flex>

							{/* Grid Wrapper */}
							<Flex direction="column" class={styles['grid-wrapper']}>
								<Flex class={styles['grid-options']} justify-content="space-between" align-items='center' style={{width: '100%'}}>
									<Flex direction="row" gap="0.5rem" align-items="center">
										<div>Sort By:</div>
										<Dropdown>
											<Dropdown.Trigger class={styles['grid-options-dropdown-trigger']} />
											<Dropdown.Placeholder style={{color: 'white'}}>Rarity</Dropdown.Placeholder>
											<Dropdown.Icon class={styles['grid-options-dropdown-icon']} />
										</Dropdown>
									</Flex>

									<Checkbox>
										<Checkbox.Control class={styles['grid-options-checkbox']} />
										<Checkbox.Label>Show Usable Only</Checkbox.Label>
									</Checkbox>
								</Flex>

								<Grid 
									cols={5} 
									rows={6} 
									gap='1rem' 
									class={`${styles.grid}`} 
									column-class={styles['grid-cell']}>
									<Grid.Tile row={1} col={1}><Icon.inventory.bag fill /></Grid.Tile>
									<Grid.Tile row={1} col={2}><Icon.inventory.bag fill /></Grid.Tile>
									<Grid.Tile class={styles["grid-item-active"]} row={1} col={3}><Icon.inventory.sword fill /></Grid.Tile>
									<Grid.Tile row={1} col={4}><Icon.inventory.bag fill /></Grid.Tile>
									<Grid.Tile row={1} col={5}><Icon.inventory.bag fill /></Grid.Tile>
									<Grid.Tile row={2} col={1}><Icon.inventory.bag fill /></Grid.Tile>
								</Grid>
							</Flex>

						</Flex>
					</Column.Six>
					<Column.Four class={`${styles['item-container']}`}>
						<Flex class={styles['item-wrapper']} direction="column" align-items="center" gap={'1.5rem'}>
							<h2 class={styles['item-inspector-label']}>Item Inspector</h2>

							<div class={styles['item-image']}>
								<Icon.inventory.sword fill />
							</div>

							<Flex direction="column" align-items="center" gap="0.5rem">
								<h3 class={styles['item-name']}>Iron Broadsword</h3>
								<div class={styles.separator}></div>
							</Flex>

							<Flex direction="column" align-items="center" gap="0.5rem" >
								<div>Damage: 15-22</div>
								<div>Speed: Medium</div>
							</Flex>

							<Flex direction="column" align-items="center" gap="0.5rem" style={{width: '80%', margin: "1rem 0"}}>
								<div>Durability</div>
								<Relative  style={{width: '100%', height: '2rem'}}>
									<Progress.Bar progress={80} style={{width: '100%', height: '100%'}} />
									<Absolute center>80%</Absolute>
								</Relative>
							</Flex>

							<Flex  direction="column" align-items="center" gap="0.5rem">
								<div>Quantity to Drop</div>
								<NumberInput value={1} style={{width: '12rem'}}>
									<NumberInput.DecreaseControl position="before" style={{width: '3rem', height: '3rem', 'font-size': '2rem'}}>{'<'}</NumberInput.DecreaseControl>
									<NumberInput.IncreaseControl style={{width: '3rem', height: '3rem', 'font-size': '2rem'}}>{'>'}</NumberInput.IncreaseControl>
									<NumberInput.Input style={{"text-align": 'center', "font-size": '1.5rem' }} />
								</NumberInput>
							
							</Flex>

							<div class={styles.separator} style={{"margin-top": '2rem'}}></div>

							<Flex gap="1rem">
								<Button class={styles['item-button']}>Equip</Button>
								<Button class={styles['item-button']}>Drop</Button>
							</Flex>

							<ToggleButton>
								<ToggleButton.LabelLeft>
									<div style={{'margin-right': '0.5rem'}}>Favorite</div>
								</ToggleButton.LabelLeft>
							</ToggleButton>
						</Flex>
					</Column.Four>
				</Tab>
			</Row>
		</Tabs >
	)
};

export default Inventory;