#!/bin/bash
# Create a new tmux session named "expo" and detach
tmux new-session -d -s expo "nvim"

# Split the window horizontally (side-by-side)
tmux split-window -h

# Attach to the session
tmux attach-session -t expo
