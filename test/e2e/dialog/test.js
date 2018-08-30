import { Selector, ClientFunction } from 'testcafe';

fixture `Dialog`
  .page `./test.html`;


test('Build a dialog without a title and message', async (t) => {
  await ClientFunction(() => {
    return phonon.dialog().show();
  })();

  await t
    .wait(1000)
    .expect(Selector('.dialog.show').exists).ok()
    .expect(Selector('.dialog.show .dialog-title').innerText).eql('')
    .expect(Selector('.dialog.show .dialog-body').innerText).eql('')
    .click('.dialog.show .btn-primary')
    .wait(1000)
    .expect(Selector('.dialog.show').exists).notOk();
});

test('Build the same dialog with jQuery', async (t) => {
  await ClientFunction(() => {
    return $().dialog().show();
  })();

  await t
    .wait(1000)
    .expect(Selector('.dialog.show').exists).ok()
    .expect(Selector('.dialog.show .dialog-title').innerText).eql('')
    .expect(Selector('.dialog.show .dialog-body').innerText).eql('')
    .click('.dialog.show .btn-primary')
    .wait(1000)
    .expect(Selector('.dialog.show').exists).notOk();
});

test('Build a dialog with a title and a message', async (t) => {
  const title = 'My Title';
  const message = 'My message';

  await ClientFunction((title, message) => {
    return phonon.dialog({ title, message }).show();
  })(title, message);

  await t
    .wait(1000)
    .expect(Selector('.dialog.show .dialog-title').innerText).eql(title)
    .expect(Selector('.dialog.show .dialog-body p').innerText).eql(message)
    .click('.dialog.show .btn-primary')
    .wait(1000)
    .expect(Selector('.dialog.show').exists).notOk();
});

test('Build a dialog with a title, a message and custom buttons', async (t) => {
  const title = 'My Title';
  const message = 'My message';
  const eventName = 'myEvent';
  const buttons = [
    {
      event: eventName,
      text: 'Custom button',
      dismiss: true,
      class: 'btn btn-primary',
    },
  ];

  // await t.eval(new Function(`phonon.dialog({title: "${title}", message: "${message}", buttons: ${JSON.stringify(buttons)}}).show();`))

  await ClientFunction((title, message, buttons) => {
    return phonon.dialog({ title, message, buttons }).show();
  })(title, message, buttons);

  await t
    .wait(1000)
    .expect(Selector('.dialog.show .dialog-title').innerText).eql(title)
    .expect(Selector('.dialog.show .dialog-body p').innerText).eql(message)
    .expect(Selector(`.dialog-footer [data-event="${eventName}"]`).innerText).eql('Custom button')
    // close the dialog with the custom button
    .click(`.dialog-footer [data-event="${eventName}"]`)
    .wait(1000)
    .expect(Selector('.dialog.show').exists).notOk();
});

test('Show a dialog from a button', async (t) => {
  const title = 'Dialog title';
  const message = 'Dialog body text goes here.';

  await t
    .click('[data-target="#exampleDialog"]')
    .wait(1000)
    .expect(Selector('.dialog.show .dialog-title').innerText).eql(title)
    .expect(Selector('.dialog.show .dialog-body p').innerText).eql(message)
    .click('.dialog.show .btn-primary')
    .wait(1000)
    .expect(Selector('.dialog.show').exists).notOk();
});

test('Close a cancelable dialog with Escape key', async (t) => {
  await ClientFunction(() => {
    return phonon.dialog().show();
  })();

  await t
    .wait(1000)
    .expect(Selector('.dialog.show').exists).ok()
    .expect(Selector('.dialog.show .dialog-title').innerText).eql('')
    .expect(Selector('.dialog.show .dialog-body').innerText).eql('')
    .pressKey('esc')
    .wait(1000)
    .expect(Selector('.dialog.show').exists).notOk();
});

test('Close a cancelable dialog by clicking on the backdrop', async (t) => {
  await ClientFunction(() => {
    return phonon.dialog().show();
  })();

  await t
    .wait(1000)
    .expect(Selector('.dialog.show').exists).ok()
    .expect(Selector('.dialog.show .dialog-title').innerText).eql('')
    .expect(Selector('.dialog.show .dialog-body').innerText).eql('')
    .click('.dialog-backdrop', { offsetX: 5, offsetY: 5 })
    .wait(1000)
    .expect(Selector('.dialog.show').exists).notOk();
});

test('Test uncancelable dialog and then close with a button', async (t) => {
  await ClientFunction(() => {
    return phonon.dialog({ cancelable: false }).show();
  })();

  await t
    .wait(1000)
    .expect(Selector('.dialog.show').exists).ok()
    .pressKey('esc')
    .wait(1000)
    .expect(Selector('.dialog.show').count).eql(1)
    .click('.dialog-backdrop', { offsetX: 5, offsetY: 5 })
    .wait(1000)
    .expect(Selector('.dialog.show').count).eql(1)
    .click('.dialog.show .btn-primary')
    .wait(1000)
    .expect(Selector('.dialog.show').exists).notOk();
});

test('Test open 2 dialogs', async (t) => {
  await ClientFunction(() => {
    phonon.dialog().show();
    phonon.dialog().show();
  })();

  await t
    .wait(1000)
    .expect(Selector('.dialog.show').count).eql(2)
    .click('.dialog-backdrop', { offsetX: 5, offsetY: 5 })
    .wait(1000)
    .expect(Selector('.dialog.show').count).eql(1)
    .click('.dialog.show .btn-primary')
    .wait(1000)
    .expect(Selector('.dialog.show').exists).notOk();
});
