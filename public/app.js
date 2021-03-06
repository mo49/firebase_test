document.addEventListener('DOMContentLoaded', function() {
  const $input = document.querySelector('#input')
  const $output = document.querySelector('#output')
  const $push = document.querySelector('#push')
  const $remove = document.querySelector('#remove')

  const db = firebase.database();
  // データベース/messageへの参照を作成
  const messageRef = db.ref('/message');
  const infoRef = db.ref('/info');

  /**
  * 読み込み・書き込み
  */
  // write
  $input.addEventListener('input', e => {
    messageRef.set(e.target.value);
  })
  // read
  messageRef.on('value',snapshot => {
    console.log(snapshot);
    $output.textContent = snapshot.val();
  })

  /**
   * 認証
   */
  const $signin = document.querySelector('#signin');
  const $signout = document.querySelector('#signout');
  // どの認証手段を使うか
  const provider = new firebase.auth.GoogleAuthProvider();

  $signin.addEventListener('click', () => {
    // 指定したproviderのサインイン画面に飛ぶ
    firebase.auth().signInWithRedirect(provider);
  })
  $signout.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
      location.reload()
    })
  })

  const user = firebase.auth().currentUser;
  // console.log(user);

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const $profile = document.querySelector('#profile')
      $profile.innerHTML = `
        <div>uid: ${user['uid']}</div>
        <div>displayName: ${user['displayName']}</div>
        <div>email: ${user['email']}</div>
        <img src="${user['photoURL']}" width="100">
      `
    } else {
      // 認証していない場合は自動的に認証画面へ
      // firebase.auth().signInWithRedirect(provider);
    }
  })

  const $list = document.querySelector('#list');
  $push.addEventListener('click', () => {
    // 重複することのないユニークなキーを生成するので
    // 何度押しても別データとして追加されていく
    infoRef.push({
      description: `your number is ` + Math.random() * 100,
    }).then((value) => {
      const keyDom = document.createElement('div');
      keyDom.textContent = value.key;
      $list.appendChild(keyDom);
    })
  })
  $remove.addEventListener('click', () => {
    // infoRef.remove();
    infoRef.set(null);
    $list.textContent = null;
  })

  infoRef.on('child_added', (data) => {
    console.log('---child_added---');
    // console.log('data.key',data.key);
  })

  window.addEventListener('keydown', e => {
    infoRef.child(`user--${e.keyCode}`).update({
      description: `user created by keycode${e.keyCode}`,
    })
  })

})
