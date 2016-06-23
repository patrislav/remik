
import _ from 'lodash'
import './emoji.scss'

const _conversionTable = {
  ":)" : "blush",
  ":-)": "blush",
  ";)" : "wink",
  ";-)": "wink",
  "8)" : "sunglasses",
  "8-)": "sunglasses",
  ":D" : "smiley",
  ":-D": "smiley",
  ";D" : "smile",
  ";-D": "smile",
  ":'D": "joy",
  ":'-D": "joy",
  ";'D": "joy",
  ";'-D": "joy",
  "xD" : "laughing",
  "XD" : "laughing",
  ":P" : "stuck_out_tongue",
  ":-P": "stuck_out_tongue",
  ":p" : "stuck_out_tongue",
  ":-p": "stuck_out_tongue",
  ";P" : "stuck_out_tongue_winking_eye",
  ";-P": "stuck_out_tongue_winking_eye",
  ";p" : "stuck_out_tongue_winking_eye",
  ";-p": "stuck_out_tongue_winking_eye",
  "xP": "stuck_out_tongue_closed_eyes",
  "x-P": "stuck_out_tongue_closed_eyes",
  ":|" : "expressionless",
  ":-|": "expressionless",
  ":\/" : "unamused",
  ":-\/": "unamused",
  "<3": "heart",
  "<\/3": "broken_heart",
  ":*" : "kissing_heart",
  ":-*": "kissing_heart",
  ";*" : "kissing_heart",
  ";-*": "kissing_heart",
  ":'(" : "sob",
  ":'-(": "sob",
  ";'(" : "sob",
  ";'-(": "sob",
  ":3":  "kissing_smiling_eyes",
  ":-3": "kissing_smiling_eyes",
  ":(": "disappointed",
  ":-(": "disappointed",
  ";(" : "cry",
  ";-(": "cry",
  ":o": "open_mouth",
  ":-o": "open_mouth",
  ":O": "open_mouth",
  ":-O": "open_mouth",
  "0:)": "innocent",
  "0:-)": "innocent",
  "O:)": "innocent",
  "O:-)": "innocent",
  ":]": "smirk",
  ":-]": "smirk",
  ";]": "smirk",
  ";-]": "smirk",
  "O_O": "flushed",
  "o_o": "flished",
  "O.O": "flushed",
  "o.o": "flushed",
  "*_*": "heart_eyes",
  "*.*": "heart_eyes",
  ":cat:": "smiley_cat",
  ":poop:": "poop",
  ":+1:": "thumbsup",
  ":-1:": "thumbsdown",
  ":v:": "v",
  ":wave:": "wave",
  ":clap:": "clap",
  ":ok:": "ok_hand",
  ":pray:": "pray",
  ":zzz:": "zzz",
  ":angry:": "angry",
  ":rage:": "rage",
  ":grin:": "grin",
  ":weary:": "weary",
  ":wink:": "wink",
  ":smirk:": "smirk",
  ":relaxed:": "relaxed",
  ":confused:": "confused",
  ":sweat:": "sweat",
  ":pensive:": "pensive",
  ":fearful:": "fearful",
  ":cry:": "cry",
  ":sob:": "sob",
  ":joy:": "joy",
  ":scream:": "scream",
  ":triumph:": "triumph",
  ":sleepy:": "sleepy",
  ":yum:": "yum",
  ":alien:": "alien",
  ":heart:": "heart"
}

const _htmlEntities = {
  '&amp;': /\&/g,
  '&lt;': /\</g,
  '&gt;': /\>/g,
  '&#39;': /\'/g,
  '&quot;': /\"/g
}

class Emoji {

  constructor() {
    let a = []
    this.emoticons = {}

    for (let i in _conversionTable) {
      let emoticon = i;
      for (let entity in _htmlEntities) {
        emoticon = emoticon.replace(_htmlEntities[entity], entity)
      }
      this.emoticons[emoticon] = _conversionTable[i].trim().replace(' ', '_')
      a.push(_.escapeRegExp(emoticon))
    }

    this.emoticonRegex = new RegExp(('(^|\\s)('+a.join('|')+')(?=$|[\\s|\\?\\.,!])'), 'g')
  }

  parse(str) {
    return _.escape(str).replace(this.emoticonRegex, (m, $1, $2) => {
      let value = this.emoticons[$2]
      return value ? $1+this.htmlFor(value, m) : m
    })
  }

  htmlFor(emoticon, alt) {
    return `<span data-emoji="${emoticon}" class="emoji emoji-${emoticon}" alt="${alt}" title="${alt}"></span>`
  }

}

const instance = new Emoji()
export default instance
