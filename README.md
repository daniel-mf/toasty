Toasty!
========

Make Dan Forden randomly pop up when your users click anywhere.

### Usage ###

Download the `./mk` folder and include the `index.js` in your HTML.

```html
<script type="text/javascript" src="mk/index.js"></script>
```

Add `toastDocument` call for random toasting at user click!

```html
<script type="text/javascript">

    // random toast at user click
    MK.toastDocument();
    
    // or you can pass a chance percentage
    MK.toastDocument(.3); // 30% toast chance. Defaults to 6%
    
</script>
```

#### Toast whenever you want to. ####

```javascript
//Invoke him.
const dan = new MK.DanForden();

//Let him toast it
dan.toast();
```

#### Disclaimer ####
The Dan Forden image and the Toasty! sound are copyright to their respective owners.  
This is an open source API made by MK fans and is 
not affiliated with said copyright owners in anyway.