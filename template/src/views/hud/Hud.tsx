import DataBindFor from '../../../../gf-ui-components/DataBindFor/DataBindFor';
import styles from './Hud.module.css';
import { ammoIt, bindModel, playerIt, weaponIt } from './model/model';

const Hud = () => {
  const playerIndex = 0;
  const weaponIndex = 0;
  setTimeout(() => {
    const players = bindModel.players;
    players[playerIndex].weapons[weaponIndex].name = 'weapoonnnnnnnnnnnnnnnnnnn';
    if (bindModel.players[0].dataTest) players[0].dataTest.test123 = 1;
    players[0].name = "Test";
    players.forEach((player) => {
      player.weapons[0].name = 'tessssssss';
    });
  }, 500);

  return (
    <div class={styles.Hud}>
      <DataBindFor model={bindModel.players} iter={playerIt}>
        <span data-bind-if={`${playerIt.health}>50`}>
          Player Health: <span data-bind-value={playerIt.health}></span>
        </span>
        Player Name: <span data-bind-value={playerIt.name}>
          I am visible
        </span>
        <DataBindFor model={playerIt.weapons} iter={weaponIt}>
          Weapon Name: <span data-bind-value={weaponIt.name}></span>
          Weapon Name: <span data-bind-value={weaponIt.test}></span>
          <DataBindFor model={weaponIt.ammo} iter={ammoIt}>
            |<span class='ammo-icon' data-bind-value={ammoIt}>
              |
            </span>
          </DataBindFor>
        </DataBindFor>
      </DataBindFor>
    </div>
  );
};

export default Hud;
