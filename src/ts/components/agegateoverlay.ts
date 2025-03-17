import {ContainerConfig, Container} from './container';
import {AgeGateContainer} from './agegatecontainer';
import {UIInstanceManager} from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
import { Button, ButtonConfig } from './button';
import { Label, LabelConfig } from './label';
import { SelectBox } from './selectbox';
import { StorageUtils } from '../storageutils';

/**
 * @category Configs
 */
export interface AgeGateOverlayConfig extends ContainerConfig {
    ageRequired?: number,
  }

/**
 * Overlays the player and displays recommended videos.
 *
 * @category Containers
 */
export class AgeGateOverlay extends Container<AgeGateOverlayConfig> {

  private monthSelect: SelectBox;
  private daySelect: SelectBox;
  private yearSelect: SelectBox;

  private controlsContainer: AgeGateContainer;

  private submitButton: Button<ButtonConfig>;

  private messageLabel: Label<LabelConfig>;
  
  private dateCookieName: string = '_zgatedate';
  private expCookieName: string = '_zgateexp';
  
  private millisecondsPerDay: number = 60*60*24*1000;
  private millisecondsPerYear: number = this.millisecondsPerDay*365;
    
  constructor(config: AgeGateOverlayConfig = {}) {
    super(config);
        
    let currentYear = new Date().getFullYear();

    this.monthSelect = new SelectBox();
    this.daySelect = new SelectBox();
    this.yearSelect = new SelectBox();

    this.monthSelect.addItem('', 'Month');
    this.monthSelect.addItem('0', 'January');
    this.monthSelect.addItem('1', 'February');
    this.monthSelect.addItem('2', 'March');
    this.monthSelect.addItem('3', 'April');
    this.monthSelect.addItem('4', 'May');
    this.monthSelect.addItem('5', 'June');
    this.monthSelect.addItem('6', 'July');
    this.monthSelect.addItem('7', 'August');
    this.monthSelect.addItem('8', 'September');
    this.monthSelect.addItem('9', 'October');
    this.monthSelect.addItem('10', 'November');
    this.monthSelect.addItem('11', 'December');

    this.daySelect.addItem('', 'Day');
    for (let i = 1; i < 31; i++) {
      this.daySelect.addItem(i.toString(),i.toString());
    }

    this.yearSelect.addItem('', 'Year');
    for (let i = 0; i < 50; i++) {
      let year = currentYear - i;
      this.yearSelect.addItem(year.toString(),year.toString());
    }

    this.submitButton = new Button<ButtonConfig>({
      cssClass: 'ui-agegatesubmitbutton',
      text: 'Submit'
    });

    this.messageLabel = new Label(<LabelConfig>{text: 'The content in this video requires age verification.'});

    this.controlsContainer = new AgeGateContainer({
      components: [
        this.monthSelect,
        this.daySelect,
        this.yearSelect
      ]
    })

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-agegate-overlay',
      components: [
        new Container<ContainerConfig>({
          components: [
            this.messageLabel
          ]
        }),
        this.controlsContainer,
        new Container<ContainerConfig>({
          components: [
            this.submitButton
          ]
        })
      ]
    }, this.config);

  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.checkAndRenderOverlay(player);

    this.submitButton.onClick.subscribe(() => {
      let year = this.yearSelect.getDomElement().val()
      let month = this.monthSelect.getDomElement().val()
      let day = this.daySelect.getDomElement().val()
      
      if(month == ''){
        this.messageLabel.setText('Please select a month');
        return false;
      }
      if(day == ''){
        this.messageLabel.setText('Please select a day');
        return false;
      }
      if(year == ''){
        this.messageLabel.setText('Please select a year');
        return false;
      }

      let date = new Date(Number(year),Number(month),Number(day));
      let expiration = new Date(new Date().getTime() + this.millisecondsPerDay);
      
      console.log("storing age values")
      StorageUtils.setItem(this.dateCookieName,date.getTime().toString());
      StorageUtils.setItem(this.expCookieName,expiration.getTime().toString());

      if(this.validateDate(date,expiration)){
        this.hide();
        player.play();
      }
    })

    player.on(player.exports.PlayerEvent.Playing, () =>{
      this.checkAndRenderOverlay(player);
    });
  }

  private checkAndRenderOverlay(player: PlayerAPI): void {
    if(this.config.ageRequired != null){
      console.log("performing age check")
      let date = Number.parseInt(StorageUtils.getItem(this.dateCookieName));
      let expiration = Number.parseInt(StorageUtils.getItem(this.expCookieName));

      if(Number.isInteger(date) && Number.isInteger(expiration)){
        if(this.validateDate(new Date(date), new Date(expiration))){
          this.hide();
          return;
        }
      } else {
        console.log("no age values found")
      }

      if(player.isPlaying()){
        player.pause();
      }

      this.show();
    } else {
      this.hide();
    }
  }

  private validateDate(date: Date, expiration: Date): boolean {
    let thresholdDate = (new Date().getTime() - this.config.ageRequired*this.millisecondsPerYear);
        
    if(date.getTime() > thresholdDate){
      console.log("failed age check")
      this.messageLabel.setText('You are not old enough to view this content.');
      this.controlsContainer.hide();
      this.submitButton.hide();
      return false;
    } else {
      console.log("passed age check")
      return true;
    }
  }
}

