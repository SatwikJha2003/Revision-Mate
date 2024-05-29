import openai
import gradio

openai.api_key = "sk-satwik-key-djba3xyeqb7mUl5NQKRyT3BlbkFJWDwHuEDcrA7sW9c33jML"

messages = [{"role": "system", "content": "You are a student revision assistant"}]

def CustomChatGPT(user_input):
    messages.append({"role": "user", "content": user_input})
    response = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo",
        messages = messages
    )
    ChatGPT_reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": ChatGPT_reply})
    return ChatGPT_reply

demo = gradio.Interface(fn=CustomChatGPT, inputs = "text", outputs = "text", title = "Revision Mate")

demo.launch(share=True)
