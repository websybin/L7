import BaseLayer from '../../../core/BaseLayer';
import { IRasterLayerStyleOptions } from '../../../core/interface';
import RasterModel from '../../../raster/models/rasterTile';
import RasterRgbModel from '../../../raster/models/rasterRgb';

export default class RasterTiffLayer extends BaseLayer<
  Partial<IRasterLayerStyleOptions>
> {
  public type: string = this.layerType as string;
  public buildModels() {
    const model = this.getModelType();
    this.layerModel = new model(this);
    this.layerModel.initModels((models) => {
      this.dispatchModelLoad(models);
    });
  }

  public rebuildModels() {
    this.layerModel.buildModels((models) => {
      this.dispatchModelLoad(models);
    });
  }

  protected getModelType() {
    if(this.layerSource.parser.type === 'rasterRgb') {
      return RasterRgbModel;
    } else {
      return RasterModel;
    }
  }

  protected getDefaultConfig() {
    return {};
  }
}
