
import requests
base_url = 'http://hair-salons.local/api/'

token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiODAzMTdlOGQ5OTIwZGE5OWIxZmRjNGE1MzVkNWYzOGQ1NGQ2M2ZmOWFjODk3ZDE1Y2M2MzdiZTk5Zjg1MGFlODc5MjdkYTljZmY3OTNjNTEiLCJpYXQiOjE2MDQ0MjgzNzUsIm5iZiI6MTYwNDQyODM3NSwiZXhwIjoxNjM1OTY0Mzc1LCJzdWIiOiIzIiwic2NvcGVzIjpbXX0.R5jPc34SSJYxC4XY84umtuxTFIbX4zmr3CMefvDm-9fhdLCfT2NVprgNI2Hv_zyteEXokAEUDD4yBlJlfJrux_pRXNBC8wfJl0i_wxqYoQ_FF6g6wf0pBzTvWaQ20nPwfayYExKobDv_UrUOsuuvcJ_cG_idJB1Pi5Tx7jzU0IkloVHZZ4MVHIHupV7biX7A-09HpFufnsM1gAE5PflCF1zzP2_UbIZEZZLwkrJhA5Vi2gDrl0grqjC_PdFwT-I84J-XvkcbggujjKPU-Xyb2avmXUl2FKFfroKzppIYiluc3lVjTIrenuL1wieci7DgvwJzprhwuZ-C837Z808FgmYlNnI5A1J6o7KVqZ_VUvviI0uv1siDkdG6364byZtT9-mHtEdRHFlMzCmRN6BlpqRvRzRi_mxxYeIiabEJNMKjU7eqwaB_Qd83WimjNNwE7IrsUU3vk-M7VSGdD6cxxcftPU76zHiZ94cXy2TOZ8kcproevJnNGVsqhRF3LZ0YkFuDy7UTCauadoDwaOx2rP_oeZyS_hhb_vBaElDpvIATi7dL3DhK78YV_qfHNO9rBPlq0XsVp3GjntPwWMtQUqZovEKacYN6faTr4d8m-L5X8YF_stRNA4nuLQdjKUAiwLuqZqhc_rUdr0epvWBqxYjUgotyz_YoTvxZ-GXzFVI'

r = requests.get(base_url + 'test',
    params={'email':'tt2@tttt.rr', 'password':'123456'},
    headers={'Accept': 'application/json',
             'Authorization' : 'Bearer ' + token,
             },
)
print (r.text[:1100] )
if len(r.text) > 1100:
    print ( '\n. . . . .' )
print (r)
