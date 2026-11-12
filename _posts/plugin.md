如何给coding agent 设计一个好用的插件系统

1. 为什么要设计一个插件系统
2. 插件系统如何演进
    - phi 的插件系统是如何的
3. 总结


因为 Phi 是使用 Go 写的, 所以很看


```rust
use phi_ext::{phi, pxb};

fn main() -> Result<(), phi::Error> {
    let mut m = phi::Extension::new("hello", "0.1.0");
    m.register_command("hello", phi::Command::new("Say hi", |_args, ctx| {
        ctx.notify("info", "Hello!");
        // ctx.submit("follow-up");      // after /hello returns
        // ctx.send_user_message("…");   // enqueue a turn anytime
        Ok(())
    }));
    m.on_user_input(|_ev| None);   // return Some(UserInputResult { handled: true, .. }) to swallow
    m.on_tool_call(|_ev| None);    // return Some(ToolCallResult { block: true, reason: "…", .. }) to deny
    m.on_tool_result(|_ev| None);  // return Some(ToolResultResult { stop: true, .. }) to end the loop
    m.subscribe(pxb::Event::SessionStart, |_ev| {});
    m.run()
}
```