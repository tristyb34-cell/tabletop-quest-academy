## IntelliTrace (Enterprise Only)

### Overview

**Path: Tools > Options > IntelliTrace**

IntelliTrace records a history of debugging events, letting you "step back in time" to see previous variable values, call stacks, and events.

| Setting | Description | Recommended for UE5 |
|---------|-------------|---------------------|
| Enable IntelliTrace | Master toggle | DISABLE for UE5 (significant performance overhead) |
| IntelliTrace events only | Record events but not call information | Lower overhead if used |
| IntelliTrace events and call information | Full recording | Very high overhead |

For .NET projects, IntelliTrace is valuable. For large C++ projects like UE5, the overhead is prohibitive.

---
