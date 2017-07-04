import { CartolaFcPage } from './app.po';

describe('cartola-fc App', function() {
  let page: CartolaFcPage;

  beforeEach(() => {
    page = new CartolaFcPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
