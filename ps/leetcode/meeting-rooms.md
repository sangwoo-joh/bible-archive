---
layout: page
tags: [problem-solving, leetcode, python, array, interval]
title: Meeting Rooms
grand_parent: Problem Solving
parent: LeetCode
nav_exclude: true
---

# [Meeting Rooms](https://leetcode.com/problems/meeting-rooms/)

 미팅 룸의 예약 시간을 나타내는 배열 `intervals`가
 들어온다. `intervals[i] = [start_i, end_i]`는 미팅의 시작 시간과 끝
 시간을 나타낸다. 한 사람이 모든 미팅에 참석할 수 있는지 여부를
 구하자.

 입력 배열의 길이는 최대 10,000 이고 각 미팅 시간의 범위는 0 ~
 1,000,000이다.

## 겹치는 부분 구하기

 미팅을 시작 시간 (또는 끝 시간으로 해도 됨) 기준으로 정렬했을 때,
 미팅 범위끼리 겹치는 부분이 있는지를 확인하는 문제이다. 따라서 이전
 범위의 끝 시간을 기록해두고, 지금 범위의 시작 시간과 겹치면 곧바로
 False이다. 전체를 다 훑었다면 겹치는 부분이 없는 것이므로 참이다.

```python
def canAttendMeetings(invertals):
    prev_end = 0
    for start, end in sorted(intervals, key=lambda x: x[0]):
        if prev_end > start:
            return False
        prev_end = end
    return True
```
