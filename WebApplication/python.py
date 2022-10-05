import speech_recognition as sr
import os
from pydub import AudioSegment
from pydub.silence import split_on_silence
from numpy import mean
from numpy import std
import pandas as pd
import numpy as np
import nltk
import re
import sys, json
data = pd.read_csv("C:/Users/DELL/Desktop/Final133/dreaddit-train.csv")
data = data[['subreddit', 'text', 'label']]
nltk.download('stopwords')
stemmer = nltk.SnowballStemmer("english")
from nltk.corpus import stopwords
import string
stopword=set(stopwords.words('english'))
def dataCleaning(inputt):
    inputt = str(inputt).lower()
    inputt = re.sub('\w*\d\w*', '', inputt)
    inputt = re.sub('\[.*?\]', '', inputt)
    inputt = re.sub('<.*?>+', '', inputt)
    inputt = re.sub('\n', '', inputt)
    inputt = re.sub('https?://\S+|www\.\S+', '', inputt)
    inputt = re.sub('[%s]' % re.escape(string.punctuation), '', inputt)
    result = []
    for word in inputt.split(' '):
        if word not in stopword:
            result.append(word)
    result= " ".join(result)
    return result
data["text"] = data["text"].apply(dataCleaning)

from wordcloud import STOPWORDS
text = " ".join(i for i in data.text)
stopwords = set(STOPWORDS)

data["label"] = data["label"].map({0: "No Stress", 1: "Stress"})
data = data[["text", "label"]]

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split

x = np.array(data["text"])
y = np.array(data["label"])

cv = CountVectorizer()
X = cv.fit_transform(x)
xtrain, xtest, ytrain, ytest = train_test_split(X, y, 
                                                test_size=0.2, 
                                                )
from sklearn.naive_bayes import BernoulliNB
model = BernoulliNB()
model.fit(xtrain, ytrain)
recognize = sr.Recognizer()
with sr.Microphone() as source:
   audio_data = recognize.record(source, duration=7)
   text = recognize.recognize_google(audio_data)
user = text
data = cv.transform([user]).toarray()
output = model.predict(data)
print(output)
