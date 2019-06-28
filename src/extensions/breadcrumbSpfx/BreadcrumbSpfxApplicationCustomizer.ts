import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';
import * as strings from 'BreadcrumbSpfxApplicationCustomizerStrings';
import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';  
import styles from './BreadcrumbSpfxApplicationCustomizer.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';

const LOG_SOURCE: string = 'BreadcrumbSpfxApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IBreadcrumbSpfxApplicationCustomizerProperties {
  // This is an example; replace with your own property
  Top: string;
  RootURL: string;
  RootTitle: string
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class BreadcrumbSpfxApplicationCustomizer
  extends BaseApplicationCustomizer<IBreadcrumbSpfxApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {

  //Sample REST Call
    // this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web?$select=Title`, SPHttpClient.configurations.v1).then((res: SPHttpClientResponse): Promise<{ Title: string; }> => 
    //   {
    //     return res.json();
    //   }
    // ).then((web: {Title: string}): void => 
    // {
    //   Dialog.alert(`Site Title: ${web.Title}`)
    // });
   
  // Wait for the placeholders to be created (or handle them being changed) and then render.
  this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    return Promise.resolve();
  }
  
  private _renderPlaceHolders(): void 
  {
    // Handling the top placeholder
    if (!this._topPlaceholder) 
    {
      this._topPlaceholder =
      this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose });
    
      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
      console.error('The expected placeholder (Top) was not found.');
      return;
      }
    
      if (this.properties) {    
        if (this._topPlaceholder.domElement) {
          let breadcrumbDiv: HTMLDivElement = document.createElement('div');
          breadcrumbDiv.innerHTML = `
          <div id="BreadcrumbSPFX" class="ms-FocusZone">
              <a href="${this.properties.RootURL}">${this.properties.RootTitle}</a>
              >
              <a href="">Site Collection</a>
              > 
              <a href="">Site 1</a>
              >
              <a href="">Site 2</a>
          </div>
          `;

          let placeholderDiv: HTMLDivElement =this._topPlaceholder.domElement;
          placeholderDiv.insertAdjacentElement("afterbegin", breadcrumbDiv);
        }
      }
    }
  }

  private _onDispose(): void {
    console.log('[Breadcrumb SPFX] Disposed custom top placeholder.');
  }

}






