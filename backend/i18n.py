from fastapi import Depends, Request
from typing import Dict

# 翻译字典
TRANSLATIONS: Dict[str, Dict[str, str]] = {
    "en": {
        "user_not_found": "User not found",
        "email_exists": "Email already exists",
        "no_update_data": "No update data provided",
        "user_deleted": "User deleted successfully",
        "invalid_credentials": "Invalid credentials",
        "admin_required": "Admin privileges required",
        "user_list": "User List",
        "create_user": "Create User",
        "edit_user": "Edit User",
        "delete_user": "Delete User",
        "status": "Status",
        "balance": "Balance",
        "service_fee": "Service Fee",
        "registration_date": "Registration Date",
        "last_login": "Last Login",
        "actions": "Actions",
        "active": "Active",
        "inactive": "Inactive",
        "confirm_delete": "Are you sure you want to delete this user?",
        "search": "Search",
        "filter": "Filter",
        "no_results": "No results found",
        "loading": "Loading...",
        "error": "Error",
        "success": "Success",
        "save": "Save",
        "cancel": "Cancel",
    },
    "zh": {
        "user_not_found": "未找到用户",
        "email_exists": "邮箱已存在",
        "no_update_data": "未提供更新数据",
        "user_deleted": "用户删除成功",
        "invalid_credentials": "无效的凭据",
        "admin_required": "需要管理员权限",
        "user_list": "用户列表",
        "create_user": "创建用户",
        "edit_user": "编辑用户",
        "delete_user": "删除用户",
        "status": "状态",
        "balance": "余额",
        "service_fee": "服务费",
        "registration_date": "注册日期",
        "last_login": "最后登录",
        "actions": "操作",
        "active": "启用",
        "inactive": "禁用",
        "confirm_delete": "确定要删除此用户吗？",
        "search": "搜索",
        "filter": "筛选",
        "no_results": "未找到结果",
        "loading": "加载中...",
        "error": "错误",
        "success": "成功",
        "save": "保存",
        "cancel": "取消",
    }
}

class Translator:
    def __init__(self, language: str = "en"):
        self.language = language
        self.translations = TRANSLATIONS.get(language, TRANSLATIONS["en"])

    def get(self, key: str) -> str:
        return self.translations.get(key, key)

async def get_translator(request: Request) -> Translator:
    # 从请求头或查询参数中获取语言设置
    language = request.headers.get("Accept-Language", "en").split(",")[0].split(";")[0]
    if language not in TRANSLATIONS:
        language = "en"
    return Translator(language) 